import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createQuizSchema } from "@/schema/quiz/schema";
import { decryptToken } from "@/lib/jwtGenerator";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let token: any = request.headers.get("x-user-token");
  let session = await decryptToken(token);
  let { id: userId } = session;
  let quiz_id = content?.params?.id;

  if (!quiz_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.quiz.findFirst({
      where: {
        id: quiz_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        chapter: true,
        completedBy: {
          where: {
            userId: userId,
          },
        },
      },
    });
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

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quiz_id = content?.params.id;

  if (!quiz_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createQuizSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const quizFound = await tx.quiz.findUnique({
      where: {
        id: quiz_id,
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        chapter: true,
      },
    });

    if (!quizFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    const chapterFound = await tx.chapter.findFirst({
      where: {
        id: data?.chapterId,
      },
      include: {
        quiz: true,
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    return await tx.quiz.update({
      data: data,
      where: {
        id: quiz_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "quiz updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let quiz_id = content?.params?.id;

  if (!quiz_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const quizFound = await tx.quiz.findFirst({
      where: {
        id: quiz_id,
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        chapter: true,
      },
    });

    if (!quizFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    return await tx.quiz.delete({
      where: {
        id: quiz_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "quiz deleted successfully",
      result,
    },
    { status: 200 }
  );
});
