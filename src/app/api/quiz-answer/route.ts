import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createQuizAnswerSchema from "@/schema/quiz-progress/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.quizAnswer.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        quizDetails: true,
        question: true,
        answer: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "quiz-progress fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    data = await validateData(createQuizAnswerSchema, data);

    return await tx.quizAnswer.create({
      data: {
        questionId: data?.quizId,
        quizProgressId: data?.quizProgressId,
        answerId: data?.answerId,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "Answer is recorded",
      result,
    },
    { status: 201 }
  );
});
