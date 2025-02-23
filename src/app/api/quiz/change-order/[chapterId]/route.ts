import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuizOrderSchema } from "@/schema/quiz/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let chapter_id = content?.params.chapterId;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  data.chapterId = chapter_id;
  data = await validateData(changeQuizOrderSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findUnique({
      where: {
        id: chapter_id,
      },
      include: {
        quiz: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Course not found", 404);
    }
    let { quiz } = data;

    let updatedQuiz = await Promise.all(
      quiz.map(async (qz: any) => {
        return await tx.quiz.update({
          data: {
            order: qz?.order,
          },
          where: { id: qz?.id },
        });
      })
    );

    return updatedQuiz;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Quizes are reorderd",
      result,
    },
    { status: 200 }
  );
});
