import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeTransactionStatusSchema } from "@/schema/transaction/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let transaction_id = content?.params.id;

  if (!transaction_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const transactionFound = await tx.transaction.findUnique({
      where: {
        id: transaction_id,
      },
      include: {
        course: true,
        user: true,
      },
    });

    if (!transactionFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    data = await validateData(changeTransactionStatusSchema, data);

    let updatedTransaction = await tx.transaction.update({
      data: data,
      where: {
        id: transaction_id,
      },
    });

    return updatedTransaction;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Success",
      result,
    },
    { status: 200 }
  );
});
