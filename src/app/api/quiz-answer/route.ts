import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createQuizAnswerSchema from "@/schema/quiz-answer/schema";
import { QuizAnswer } from "@prisma/client";

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
  data = await validateData(createQuizAnswerSchema, data);

  let quizProgressFound = await prisma.quizProgress.findFirst({
    where: {
      id: data?.quizProgressId,
    },
    include: {
      quiz: {
        select: {
          questions: {
            where: {
              id: data?.questionId,
            },
            select: {
              id: true,
              answer: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let questionId = quizProgressFound?.quiz?.questions?.find(
    (qs) => qs?.id === data?.questionId
  );

  let result = await prisma.$transaction(async (tx) => {
    let createdAnswer: any = await tx.quizAnswer.create({
      data: {
        questionId: data?.questionId,
        quizProgressId: data?.quizProgressId,
        answerId: data?.answerId,
      },
    });

    let isCorrect = questionId?.answer?.id === data?.answerId;

    // if (isCorrect) {
    //   await tx.quizProgress.update({
    //     data: {
    //       correct: {
    //         increment: 1,
    //       },
    //     },
    //     where: {
    //       id: data?.quizProgressId,
    //     },
    //   });
    // } else {
    //   await tx.quizProgress.update({
    //     data: {
    //       wrong: {
    //         increment: 1,
    //       },
    //     },
    //     where: {
    //       id: data?.quizProgressId,
    //     },
    //   });
    // }

    createdAnswer.isCorrect = isCorrect;

    return createdAnswer;
  });

  return NextResponse.json(
    {
      status: true,
      message: result?.isCorrect ? "Answer is correct" : "Answer is wrong",
      result,
    },
    { status: 201 }
  );
});
