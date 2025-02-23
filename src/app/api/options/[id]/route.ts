import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createQuestionSchema } from "@/schema/question/schema";
import { createOptionSchema } from "@/schema/options/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let option_id = content?.params?.id;

  if (!option_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.option.findFirst({
      where: {
        id: option_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        question: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "options fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let option_id = content?.params.id;

  if (!option_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createOptionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const optionFound = await tx.option.findUnique({
      where: {
        id: option_id,
      },
      include: {
        question: true,
      },
    });

    if (!optionFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    const questionFound = await tx.question.findFirst({
      where: {
        id: data?.questionId,
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!questionFound) {
      throw new ErrorHandler("Question not found", 404);
    }

    return await tx.option.update({
      data: data,
      where: {
        id: option_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "option updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let option_id = content?.params?.id;

  if (!option_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const optionFound = await tx.option.findFirst({
      where: {
        id: option_id,
      },
      include: {
        question: true,
      },
    });

    if (!optionFound) {
      throw new ErrorHandler("Option not found", 404);
    }

    return await tx.option.delete({
      where: {
        id: option_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "option deleted successfully",
      result,
    },
    { status: 200 }
  );
});
