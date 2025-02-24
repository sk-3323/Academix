import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuizStatusSchema } from "@/schema/quiz/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let quiz_id = content?.params.id;

  if (!quiz_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const quizFound = await tx.quiz.findUnique({
      where: {
        id: quiz_id,
      },
      include: {
        questions: {
          orderBy: {
            order: "desc",
          },
        },
        chapter: true,
      },
    });

    if (!quizFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    if (
      !quizFound?.title ||
      !quizFound?.passingScore ||
      !quizFound?.questions?.some(
        (question: any) => question?.status === "PUBLISHED"
      )
    ) {
      throw new ErrorHandler("Missing fields are required!", 400);
    }

    data = await validateData(changeQuizStatusSchema, data);

    let updatedQuiz = await tx.quiz.update({
      data: data,
      where: {
        id: quiz_id,
      },
    });

    let updatedQuizFound = await tx.quiz.findMany({
      where: {
        id: quiz_id,
        status: "PUBLISHED",
      },
    });

    if (!updatedQuizFound?.length) {
      await tx.chapter.update({
        data: {
          status: "DRAFT",
        },
        where: {
          id: updatedQuiz?.chapterId,
        },
      });
    }

    return updatedQuiz;
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "DRAFT"
          ? "quiz has sent to draft"
          : "quiz has been published",
      result,
    },
    { status: 200 }
  );
});
