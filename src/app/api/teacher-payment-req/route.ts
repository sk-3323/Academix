import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { formDataToJsonWithoutFiles, validateData } from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { prisma } from "@/lib/prisma";
import { createPayementReqSchema } from "@/schema/teacher-payment-req/schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(async (req: NextRequest, content: any) => {
  let token: any = req.headers.get("x-user-token");
  let { id, isAdmin } = await decryptToken(token);
  if (!token || !id) {
    throw new ErrorHandler("Unauthorized : invalid or empty token", 401);
  }
  let result = await prisma.$transaction(async (tx) => {
    if (isAdmin) {
      return tx.teacherPaymentRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return tx.teacherPaymentRequest.findMany({
        where: {
          userId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  });
  return NextResponse.json(
    {
      status: true,
      message: "Payment request fetched successfully",
      result,
    },
    {
      status: 200,
    }
  );
});

export const POST = apiHandler(async (req: NextRequest, content: any) => {
  let token: any = req.headers.get("x-user-token");
  let session = await decryptToken(token);
  let { id: instructorId } = session;

  if (!token || !instructorId) {
    throw new ErrorHandler("Unauthorized : invalid or empty token", 401);
  }
  const formData = await req.formData();
  let data: any = formDataToJsonWithoutFiles(formData);
  data = validateData(createPayementReqSchema, data);
  let result = await prisma.$transaction(async (tx) => {
    const paymentRequestExist = await tx.teacherPaymentRequest.findFirst({
      where: {
        courseId: data.courseId,
        userId: instructorId,
        amount: data.amount,
      },
    });
    if (paymentRequestExist) {
      throw new ErrorHandler("Payment request already exists", 400);
    }
    return await tx.teacherPaymentRequest.create({
      data: {
        courseId: data.courseId,
        userId: instructorId,
        amount: data.amount,
      },
    });
  });
  return NextResponse.json(
    {
      status: true,
      message: "Payment request send successfully",
      result,
    },
    {
      status: 201,
    }
  );
});
