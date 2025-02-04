import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "../../../lib/fileHandler";
import { createChapterSchema } from "../../../schema/chapter/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.chapter.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        topics: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "chapters fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const courseFound = await tx.course.findUnique({
      where: {
        id: data?.course_id,
      },
      include: {
        chapters: true,
      },
    });

    if (!courseFound) {
      throw new ErrorHandler("Course not found", 404);
    }

    data.order = courseFound.chapters.length + 1;

    data = await validateData(createChapterSchema, data);

    return await prisma.chapter.create({
      data: data,
      include: {
        topics: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "chapter created successfully",
      result,
    },
    { status: 201 }
  );
});
