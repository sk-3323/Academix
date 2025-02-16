import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createEnrollmentSchema from "@/schema/enrollment/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let enrollment_id = content?.params?.id;

  if (!enrollment_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.enrollment.findFirst({
      where: {
        id: enrollment_id,
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
      message: "enrollment fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let enrollment_id = content?.params.id;

  if (!enrollment_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const enrollmentFound = await tx.enrollment.findUnique({
      where: {
        id: enrollment_id,
      },
    });

    if (!enrollmentFound) {
      throw new ErrorHandler("Enrollment not found", 404);
    }

    let data = await request.json();

    data = await validateData(createEnrollmentSchema, data);

    return await tx.enrollment.update({
      data: data,
      where: {
        id: enrollment_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "enrollment updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let enrollment_id = content?.params?.id;

  if (!enrollment_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const enrollmentFound = await tx.enrollment.count({
      where: {
        id: enrollment_id,
      },
    });

    if (enrollmentFound === 0) {
      throw new ErrorHandler("Enrollment not found", 404);
    }

    return await tx.enrollment.delete({
      where: {
        id: enrollment_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "enrollment deleted successfully",
      result,
    },
    { status: 200 }
  );
});
