import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData, videoAsset } from "@/lib/fileHandler";
import { createTransactionSchema } from "@/schema/transaction/schema";
import { createPaymentRequestSchema } from "@/schema/payment-request/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let request_id = content?.params?.id;

  if (!request_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.teacherPaymentRequest.findFirst({
      where: {
        id: request_id,
      },
      orderBy: {
        createdAt: "desc",
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
      message: "requests fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let request_id = content?.params.id;

  if (!request_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createPaymentRequestSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const requestFound = await tx.teacherPaymentRequest.findUnique({
      where: {
        id: request_id,
      },
    });

    if (!requestFound) {
      throw new ErrorHandler("Request not found", 404);
    }

    return await tx.teacherPaymentRequest.update({
      data: data,
      where: {
        id: request_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "request updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let request_id = content?.params?.id;

  if (!request_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const requestFound = await tx.teacherPaymentRequest.findFirst({
      where: {
        id: request_id,
      },
    });

    if (!requestFound) {
      throw new ErrorHandler("Request not found", 404);
    }

    return await tx.teacherPaymentRequest.delete({
      where: {
        id: request_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "request deleted successfully",
      result,
    },
    { status: 200 }
  );
});
