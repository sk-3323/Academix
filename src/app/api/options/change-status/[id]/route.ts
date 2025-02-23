import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeQuestionStatusSchema } from "@/schema/question/schema";
import { changeOptionOrderSchema, changeOptionStatusSchema } from "@/schema/options/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let option_id = content?.params.id;

  if (!option_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const optionFound = await tx.option.findUnique({
      where: {
        id: option_id,
      },
      include: {
        question: true,
      },
    });

    if (!optionFound) {
      throw new ErrorHandler("Option not found", 404);
    }

    if (!optionFound?.title) {
      throw new ErrorHandler("Missing fields are required!", 400);
    }

    data = await validateData(changeOptionStatusSchema, data);

    let updatedOption = await tx.option.update({
      data: data,
      where: {
        id: option_id,
      },
    });

    let updatedOptionFound = await tx.option.findMany({
      where: {
        id: option_id,
        status: "PUBLISHED",
      },
    });

    if (!updatedOptionFound?.length) {
      await tx.question.update({
        data: {
          status: "DRAFT",
        },
        where: {
          id: updatedOption?.questionId,
        },
      });
    }

    return updatedOption;
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "DRAFT"
          ? "Option has sent to draft"
          : "Option has been published",
      result,
    },
    { status: 200 }
  );
});
