import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createQuizAnswerSchema from "@/schema/quiz-progress/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let quizAnswer_id = content?.params?.id;

  if (!quizAnswer_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.quizAnswer.findFirst({
      where: {
        id: quizAnswer_id,
      },
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

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "quiz answer fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quizAnswer_id = content?.params.id;

  if (!quizAnswer_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const quizAnswerFound = await tx.quizAnswer.findUnique({
      where: {
        id: quizAnswer_id,
      },
    });

    if (!quizAnswerFound) {
      throw new ErrorHandler("quiz answer not found", 404);
    }

    let data = await request.json();

    data = await validateData(createQuizAnswerSchema, data);

    return await tx.quizAnswer.update({
      data: data,
      where: {
        id: quizAnswer_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user answer updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let quizAnswer_id = content?.params?.id;

  if (!quizAnswer_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const quizAnswerFound = await tx.quizAnswer.count({
      where: {
        id: quizAnswer_id,
      },
    });

    if (quizAnswerFound === 0) {
      throw new ErrorHandler("User answer not found", 404);
    }

    return await tx.quizAnswer.delete({
      where: {
        id: quizAnswer_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user answer deleted successfully",
      result,
    },
    { status: 200 }
  );
});
