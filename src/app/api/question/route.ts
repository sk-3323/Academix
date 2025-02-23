import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { createQuizSchema } from "@/schema/quiz/schema";
import { createQuestionSchema } from "@/schema/question/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    const searchParams = request.nextUrl.searchParams;
    let conditions: any = {};

    const status = searchParams.get("status");

    if (status) {
      conditions.status = status;
    }

    const quizId = searchParams.get("quizId");

    if (quizId) {
      conditions.quizId = quizId;
    }

    return await tx.question.findMany({
      where: conditions,
      orderBy: {
        id: "desc",
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
        quiz: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "questions fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  data = await validateData(createQuestionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const quizFound = await tx.quiz.findFirst({
      where: {
        id: data?.quizId,
      },
      include: {
        questions: true,
      },
    });

    if (!quizFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    let lastQuestion = await prisma.question.findFirst({
      where: {
        quizId: quizFound?.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    data.order = lastQuestion?.order ? lastQuestion?.order + 1 : 1;

    return await prisma.question.create({
      data: data,
      include: {
        options: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "question created successfully",
      result,
    },
    { status: 201 }
  );
});
