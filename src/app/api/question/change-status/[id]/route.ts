import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuestionStatusSchema } from "@/schema/question/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let question_id = content?.params.id;

  if (!question_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const questionFound = await tx.question.findUnique({
      where: {
        id: question_id,
      },
      include: {
        options: {
          orderBy: {
            order: "desc",
          },
        },
        quiz: true,
        answer: true,
      },
    });

    if (!questionFound) {
      throw new ErrorHandler("Question not found", 404);
    }

    if (
      !questionFound?.title ||
      !questionFound?.points ||
      !questionFound?.answerId ||
      !questionFound?.options?.some(
        (option: any) => option?.status === "PUBLISHED"
      )
    ) {
      throw new ErrorHandler("Missing fields are required!", 400);
    }

    data = await validateData(changeQuestionStatusSchema, data);

    let updatedQuestion = await tx.question.update({
      data: data,
      where: {
        id: question_id,
      },
    });

    let updatedQuestionFound = await tx.question.findMany({
      where: {
        id: question_id,
        status: "PUBLISHED",
      },
    });

    if (!updatedQuestionFound?.length) {
      await tx.quiz.update({
        data: {
          status: "DRAFT",
        },
        where: {
          id: updatedQuestion?.quizId,
        },
      });
    }

    return updatedQuestion;
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "DRAFT"
          ? "question has sent to draft"
          : "question has been published",
      result,
    },
    { status: 200 }
  );
});
