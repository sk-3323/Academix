import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { validateData } from "@/lib/fileHandler";
import { prisma } from "@/lib/prisma";
import createQuizProgressSchema from "@/schema/quiz-progress/schema";
import { NextRequest, NextResponse } from "next/server";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quizProgress_id = content?.params.id;

  if (!quizProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  let requiredFields = request?.nextUrl?.searchParams;
  data = await validateData(createQuizProgressSchema, data, requiredFields);

  let result = await prisma.$transaction(async (tx) => {
    const quizProgressFound = await tx.quizProgress.findUnique({
      where: {
        id: quizProgress_id,
      },
    });

    if (!quizProgressFound) {
      throw new ErrorHandler("User progress not found", 404);
    }

    let updatedData = await tx.quizProgress.update({
      data: data,
      where: {
        id: quizProgress_id,
      },
    });

    return updatedData;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Quiz complete",
      result,
    },
    { status: 200 }
  );
});
