import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    let courses = await tx.course.count();
    let students = await tx.user.count({
      where: {
        role: "STUDENT",
      },
    });
    let teachers = await tx.user.count({
      where: {
        role: "TEACHER",
      },
    });

    let topCourses = await tx.course.findMany({
      take: 6,
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      include: {
        instructor: true,
        category: true,
        chapters: true,
        enrollments: true,
      },
    });

    return {
      courses,
      students,
      teachers,
      topCourses,
    };
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "data fetched successfully",
      result,
    },
    { status: 200 }
  );
});
