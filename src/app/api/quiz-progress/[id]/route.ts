import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createQuizProgressSchema from "@/schema/quiz-progress/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let quizProgress_id = content?.params?.id;

  if (!quizProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.quizProgress.findFirst({
      where: {
        id: quizProgress_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        quiz: true,
        user: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "user progress fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quizProgress_id = content?.params.id;

  if (!quizProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const quizProgressFound = await tx.quizProgress.findUnique({
      where: {
        id: quizProgress_id,
      },
    });

    if (!quizProgressFound) {
      throw new ErrorHandler("User progress not found", 404);
    }

    let data = await request.json();

    data = await validateData(createQuizProgressSchema, data);

    return await tx.quizProgress.update({
      data: data,
      where: {
        id: quizProgress_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user progress updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let quizProgress_id = content?.params?.id;

  if (!quizProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const quizProgressFound = await tx.quizProgress.count({
      where: {
        id: quizProgress_id,
      },
    });

    if (quizProgressFound === 0) {
      throw new ErrorHandler("User progress not found", 404);
    }

    return await tx.quizProgress.delete({
      where: {
        id: quizProgress_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user progress deleted successfully",
      result,
    },
    { status: 200 }
  );
});
