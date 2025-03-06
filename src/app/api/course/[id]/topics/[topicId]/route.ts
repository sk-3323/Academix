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
                    status: {
                      not: "DROPPED",
                    },
                    payment_status: "PAID",
                  },
                },
              },
            },
            resources: true,
            quiz: {
              where: {
                status: "PUBLISHED",
              },
              orderBy: {
                order: "asc",
              },
            },
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

    // Check if there's a next topic in the same chapter
    let nextTopic: any = await tx.topic.findFirst({
      where: {
        status: "PUBLISHED",
        order: {
          gt: topic?.order,
        },
        chapterId: topic?.chapter?.id,
      },
    });

    if (nextTopic) {
      nextTopic.nextType = "TOPIC";
    }

    // If no next topic, check if there are quizzes in the chapter
    if (!nextTopic && topic?.chapter?.quiz?.length > 0) {
      // Use the first quiz as the next item
      nextTopic = {
        id: topic?.chapter?.quiz?.[0].id,
        nextType: "QUIZ",
      };
    }

    // If still no next topic, look for the first topic in the next chapter
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
            where: {
              status: "PUBLISHED",
            },
            orderBy: {
              order: "asc",
            },
            take: 1,
          },
        },
      });

      if (nextChapter?.topics && nextChapter?.topics?.length > 0) {
        nextTopic = nextChapter?.topics?.[0];
        nextTopic.nextType = "TOPIC";
      }
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
