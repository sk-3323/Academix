import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getProgress } from "../../../../../with-progress/route";

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params?.id;
  let chapter_id = content?.params?.chapterId;
  let topic_id = content?.params?.topicId;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: userId, ...session } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    let course: any = await tx.course.findFirst({
      where: {
        id: course_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        instructor: true,
        category: true,
        chapters: {
          where: {
            id: chapter_id,
            status: "PUBLISHED",
          },
          include: {
            resources: true,
            topics: {
              where: {
                id: topic_id,
                status: "PUBLISHED",
              },
              include: {
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
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        certificates: true,
      },
    });

    let nextTopic: any = await tx.topic.findFirst({
      where: {
        status: "PUBLISHED",
        order: {
          gt: course?.chapters?.[0]?.topics?.[0]?.order,
        },
        chapterId: chapter_id,
      },
    });

    if (!nextTopic) {
      let nextChapter = await tx.chapter.findFirst({
        where: {
          status: "PUBLISHED",
          order: {
            gt: course?.chapters?.[0]?.order,
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

      nextTopic = nextChapter?.topics;
    }

    let progressCount = await getProgress(userId, course?.id!);
    course.progressCount = progressCount;
    course.nextTopic = nextTopic;
    return course;
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
