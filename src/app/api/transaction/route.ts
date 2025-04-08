import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { createTransactionSchema } from "@/schema/transaction/schema";

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
      const removeQuesMark = userId.substring(0, userId.length - 1);

      conditions.userId = removeQuesMark;
    }

    return await tx.transaction.findMany({
      where: conditions,
      orderBy: {
        id: "desc",
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
      message: "transactions fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  data = await validateData(createTransactionSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const courseFound = await tx.course.findFirst({
      where: {
        id: data?.courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!courseFound) {
      throw new ErrorHandler("Course not found", 404);
    }

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
      message: "transaction is recorded",
      result,
    },
    { status: 201 }
  );
});
