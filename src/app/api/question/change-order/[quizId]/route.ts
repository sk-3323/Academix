import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuestionOrderSchema } from "@/schema/question/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quiz_id = content?.params.quizId;

  if (!quiz_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  data.quizId = quiz_id;
  data = await validateData(changeQuestionOrderSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const quizFound = await tx.quiz.findUnique({
      where: {
        id: quiz_id,
      },
      include: {
        questions: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    if (!quizFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }
    let { questions } = data;

    let updatedQuiz = await Promise.all(
      questions.map(async (question: any) => {
        return await tx.question.update({
          data: {
            order: question?.order,
          },
          where: { id: question?.id },
        });
      })
    );

    return updatedQuiz;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Questions are reorderd",
      result,
    },
    { status: 200 }
  );
});
