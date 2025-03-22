import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createPaymentRequestSchema } from "@/schema/payment-request/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    const searchParams = request.nextUrl.searchParams;
    let conditions: any = {};

    const status = searchParams.get("status");

    if (status) {
      conditions.status = status;
    }

    const courseId = searchParams.get("courseId");

    if (courseId) {
      conditions.courseId = courseId;
    }

    const userId = searchParams.get("userId");

    if (userId) {
      conditions.userId = userId;
    }

    return await tx.teacherPaymentRequest.findMany({
      where: conditions,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        course: true,
        user: true,
      },
    });
  });

  if (result?.length === 0) {
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

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  data = await validateData(createPaymentRequestSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const userFound = await tx.user.findFirst({
      where: {
        id: data?.userId,
      },
    });

    if (!userFound) {
      throw new ErrorHandler("User not found", 404);
    }

    return await prisma.transaction.create({
      data: data,
      include: {
        course: true,
        user: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "request is initiated",
      result,
    },
    { status: 201 }
  );
});
