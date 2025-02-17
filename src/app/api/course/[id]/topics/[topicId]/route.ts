import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getProgress } from "../../../with-progress/route";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params?.id;
  let topic_id = content?.params?.topicId;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: userId } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    let topic: any = await tx.topic.findFirst({
      where: {
        id: topic_id,
      },
      include: {
        chapter: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
            resources: true,
          },
        },
        muxData: true,
        userProgress: {
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!topic) {
      throw new ErrorHandler("Topic not found", 404);
    }

    let nextTopic: any = await tx.topic.findFirst({
      where: {
        status: "PUBLISHED",
        order: {
          gt: topic?.order,
        },
        chapterId: topic?.chapter?.id,
      },
    });

    if (!nextTopic) {
      let nextChapter = await tx.chapter.findFirst({
        where: {
          status: "PUBLISHED",
          order: {
            gt: topic?.chapter?.order,
          },
          courseId: course_id,
        },
        include: {
          topics: {
            orderBy: {
              order: "asc",
            },
            take: 1,
          },
        },
      });

      nextTopic = nextChapter?.topics?.[0];
    }

    let progressCount = await getProgress(userId, course_id!);
    topic.progressCount = progressCount;
    topic.nextTopic = nextTopic;
    return topic;
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "topic fetched successfully",
      result,
    },
    { status: 200 }
  );
});
