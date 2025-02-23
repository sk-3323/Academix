import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuestionOrderSchema } from "@/schema/question/schema";
import { changeOptionOrderSchema } from "@/schema/options/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let option_id = content?.params.optionId;

  if (!option_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  data.optionId = option_id;
  data = await validateData(changeOptionOrderSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const questionFound = await tx.question.findUnique({
      where: {
        id: option_id,
      },
      include: {
        options: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    if (!questionFound) {
      throw new ErrorHandler("Quiz not found", 404);
    }
    let { options } = data;

    let updatedOptions = await Promise.all(
      options.map(async (option: any) => {
        return await tx.option.update({
          data: {
            order: option?.order,
          },
          where: { id: option?.id },
        });
      })
    );

    return updatedOptions;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Options are reorderd",
      result,
    },
    { status: 200 }
  );
});
