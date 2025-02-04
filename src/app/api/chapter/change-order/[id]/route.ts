import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "../../../../../lib/fileHandler";
import { changeChapterOrderSchema } from "@/schema/chapter/schema";

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

    data = await validateData(changeChapterOrderSchema, data);

    // Create a Set for O(1) lookup
    let existingChapterIds = courseFound.chapters.map((ch) => ch.id);

    let isInvalidIds = data?.chapters?.filter(
      (chapter: any) => !existingChapterIds.includes(chapter)
    );

    if (isInvalidIds) {
      throw new ErrorHandler("Invalid Chapter Id is provided", 400);
    }
    let { chapters } = data;

    let updatedChapters = await Promise.all(
      chapters.map(async (chapter: any, index: number) => {
        return await tx.chapter.update({
          data: {
            order: ++index,
          },
          where: {
            id: chapter?.id,
          },
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
