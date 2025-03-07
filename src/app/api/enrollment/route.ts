import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createEnrollmentSchema from "@/schema/enrollment/schema";
import { decryptToken } from "@/lib/jwtGenerator";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let token: any = request.headers.get("x-user-token");
  let { id: userId } = await decryptToken(token);

  const searchParams = request.nextUrl.searchParams;
  let conditions: any = {};

  const courseId = searchParams.get("courseId");
  if (courseId && userId) {
    conditions.userId_courseId = { courseId: courseId, userId: userId };
  }

  const id = searchParams.get("userId");
  if (userId) {
    conditions.userId = id;
  }

  const payment_status = searchParams.get("payment_status");
  if (payment_status) {
    conditions.payment_status = payment_status;
  }

  const not_status = searchParams.get("not_status");
  if (not_status) {
    conditions.status = { not: not_status };
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.enrollment.findMany({
      where: conditions,
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
      message: "enrollment fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    data = await validateData(createEnrollmentSchema, data);

    return await tx.enrollment.create({
      data: data,
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "enrollment created successfully",
      result,
    },
    { status: 201 }
  );
});
