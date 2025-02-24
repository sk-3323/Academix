import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { createQuizSchema } from "@/schema/quiz/schema";
import { createQuestionSchema } from "@/schema/question/schema";
import { createOptionSchema } from "@/schema/options/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    const searchParams = request.nextUrl.searchParams;
    let conditions: any = {};

    const status = searchParams.get("status");

    if (status) {
      conditions.status = status;
    }

    const questionId = searchParams.get("questionId");

    if (questionId) {
      conditions.questionId = questionId;
    }

    return await tx.option.findMany({
      where: conditions,
      orderBy: {
        id: "desc",
      },
      include: {
        question: true,
      },
    });
  });

  if (result?.length === 0) {
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

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  data = await validateData(createOptionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
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
      throw new ErrorHandler("Quiz not found", 404);
    }

    let lastOption: any = await prisma.option.findFirst({
      where: {
        questionId: questionFound?.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    data.order = lastOption?.order ? lastOption?.order + 1 : 1;

    if (data?.order < 6) {
      throw new ErrorHandler("You can add upto 5 options", 400);
    }

    return await prisma.option.create({
      data: data,
      include: {
        question: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "Option created successfully",
      result,
    },
    { status: 201 }
  );
});
