import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { createQuizSchema } from "@/schema/quiz/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    const searchParams = request.nextUrl.searchParams;
    let conditions: any = {};

    const status = searchParams.get("status");

    if (status) {
      conditions.status = status;
    }

    const chapterId = searchParams.get("chapterId");

    if (chapterId) {
      conditions.chapterId = chapterId;
    }

    return await tx.quiz.findMany({
      where: conditions,
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
      },
    });
  });

  if (result?.length === 0) {
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

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  data = await validateData(createQuizSchema, data);

  let result = await prisma.$transaction(async (tx) => {
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

    let lastQuiz = await prisma.quiz.findFirst({
      where: {
        chapterId: chapterFound?.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    data.order = lastQuiz?.order ? lastQuiz?.order + 1 : 1;

    return await prisma.quiz.create({
      data: data,
      include: {
        questions: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "quiz created successfully",
      result,
    },
    { status: 201 }
  );
});
