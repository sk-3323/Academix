import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createQuestionSchema } from "@/schema/question/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let question_id = content?.params?.id;

  if (!question_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.question.findFirst({
      where: {
        id: question_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
        answer: true,
        quiz: true,
      },
    });
  });

  if (!result) {
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

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let question_id = content?.params.id;

  if (!question_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createQuestionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const questionFound = await tx.question.findUnique({
      where: {
        id: question_id,
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
        answer: true,
        quiz: true,
      },
    });

    if (!questionFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }

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

    return await tx.question.update({
      data: data,
      where: {
        id: question_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "question updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let question_id = content?.params?.id;

  if (!question_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const questionFound = await tx.question.findFirst({
      where: {
        id: question_id,
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
        answer: true,
        quiz: true,
      },
    });

    if (!questionFound) {
      throw new ErrorHandler("Question not found", 404);
    }

    return await tx.question.delete({
      where: {
        id: question_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "question deleted successfully",
      result,
    },
    { status: 200 }
  );
});
