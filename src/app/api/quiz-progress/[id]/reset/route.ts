import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (request: NextRequest, content: any) => {
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

    let updatedData = await tx.quizProgress.update({
      data: {
        isCompleted: false,
        correct: 0,
        wrong: 0,
      },
      where: {
        id: quizProgress_id,
      },
    });

    if (updatedData) {
      await tx.quizAnswer.deleteMany({
        where: {
          quizProgressId: quizProgress_id,
        },
      });
    }

    return updatedData;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Quiz restarted",
      result,
    },
    { status: 200 }
  );
});
