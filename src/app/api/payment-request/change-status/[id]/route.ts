import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeTransactionStatusSchema } from "@/schema/transaction/schema";
import { changePaymentRequestStatusSchema } from "@/schema/payment-request/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let request_id = content?.params.id;

  if (!request_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const requestFound = await tx.teacherPaymentRequest.findUnique({
      where: {
        id: request_id,
      },
      include: {
        course: true,
        user: true,
      },
    });

    if (!requestFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    data = await validateData(changePaymentRequestStatusSchema, data);

    if (data?.status === "APPROVED") {
      await tx.transaction.create({
        data: {
          type: "DEBIT",
          amount: requestFound?.amount,
          status: "COMPLETED",
          description: `₹${requestFound?.amount?.toFixed(2)} withdrawled by ${requestFound?.user?.username} on ${new Date().toLocaleString()}.`,
          paymentMethod: requestFound?.paymentMethod,
          userId: requestFound?.userId,
        },
      });

      await tx.user.update({
        data: {
          wallet_balance: {
            decrement: requestFound?.amount,
          },
        },
        where: {
          id: requestFound?.userId,
        },
      });
    }

    let updatedTransaction = await tx.teacherPaymentRequest.update({
      data: data,
      where: {
        id: request_id,
      },
      select: {
        status: true,
      },
    });

    return updatedTransaction;
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "APPROVED"
          ? "Request is Approved"
          : "Request is Rejected",
      result,
    },
    { status: 200 }
  );
});
