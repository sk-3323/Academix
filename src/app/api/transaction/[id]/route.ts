import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData, videoAsset } from "@/lib/fileHandler";
import { createTransactionSchema } from "@/schema/transaction/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let transaction_id = content?.params?.id;

  if (!transaction_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.transaction.findFirst({
      where: {
        id: transaction_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        course: true,
        user: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "transaction fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let transaction_id = content?.params.id;

  if (!transaction_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createTransactionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const transactionFound = await tx.transaction.findUnique({
      where: {
        id: transaction_id,
      },
    });

    if (!transactionFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    return await tx.transaction.update({
      data: data,
      where: {
        id: transaction_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "chapter updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let transaction_id = content?.params?.id;

  if (!transaction_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const transactionFound = await tx.transaction.findFirst({
      where: {
        id: transaction_id,
      },
    });

    if (!transactionFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    return await tx.transaction.delete({
      where: {
        id: transaction_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "transaction deleted successfully",
      result,
    },
    { status: 200 }
  );
});
