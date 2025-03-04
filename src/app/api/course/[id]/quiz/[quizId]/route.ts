import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params?.id;
  let quiz_id = content?.params?.quizId;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: userId } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    let quiz: any = await tx.quiz.findFirst({
      where: {
        id: quiz_id,
        status: "PUBLISHED",
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
          },
        },
        completedBy: {
          where: {
            userId: userId,
          },
          include: {
            userAnswers: true,
          },
        },
        questions: {
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
              where: {
                status: "PUBLISHED",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
          where: {
            status: "PUBLISHED",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!quiz) {
      throw new ErrorHandler("quiz not found", 404);
    }

    let nextquiz: any = await tx.quiz.findFirst({
      where: {
        status: "PUBLISHED",
        order: {
          gt: quiz?.order,
        },
        chapterId: quiz?.chapter?.id,
      },
    });

    if (!nextquiz) {
      let nextChapter = await tx.chapter.findFirst({
        where: {
          status: "PUBLISHED",
          order: {
            gt: quiz?.chapter?.order,
          },
          courseId: course_id,
        },
        include: {
          quiz: {
            orderBy: {
              order: "asc",
            },
            take: 1,
          },
        },
      });

      nextquiz = nextChapter?.quiz?.[0];
    }
    quiz.nextquiz = nextquiz;

    return quiz;
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "quiz fetched successfully",
      result,
    },
    { status: 200 }
  );
});
