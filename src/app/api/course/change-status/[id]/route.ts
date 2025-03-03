import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createCourseSchema } from "@/schema/course/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params.id;

  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const courseFound = await tx.course.findUnique({
      where: {
        id: course_id,
      },
      include: {
        chapters: {
          where: {
            status: "PUBLISHED",
          },
        },
      },
    });

    if (!courseFound) {
      throw new ErrorHandler("Course not found", 404);
    }

    if (
      !courseFound?.title ||
      !courseFound?.description ||
      !courseFound?.categoryId ||
      !courseFound?.thumbnail ||
      !courseFound?.chapters?.length
    ) {
      throw new ErrorHandler("Missing fields are required!", 400);
    }

    data = await validateData(createCourseSchema, data);

    return await tx.course.update({
      data: data,
      where: {
        id: course_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "DRAFT"
          ? "course has sent to draft"
          : "course has been published",
      result,
    },
    { status: 200 }
  );
});
