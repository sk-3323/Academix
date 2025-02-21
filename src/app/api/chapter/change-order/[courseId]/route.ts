import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeChapterOrderSchema } from "@/schema/chapter/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params.courseId;

  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  data.courseId = course_id;
  data = await validateData(changeChapterOrderSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const courseFound = await tx.course.findUnique({
      where: {
        id: course_id,
      },
      include: {
        chapters: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    if (!courseFound) {
      throw new ErrorHandler("Course not found", 404);
    }
    let { chapters } = data;

    let updatedChapters = await Promise.all(
      chapters.map(async (chapter: any) => {
        return await tx.chapter.update({
          data: {
            order: chapter?.order,
          },
          where: { id: chapter?.id },
        });
      })
    );

    return updatedChapters;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Chapters are reorderd",
      result,
    },
    { status: 200 }
  );
});
