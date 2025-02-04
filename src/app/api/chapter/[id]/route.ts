import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "../../../../lib/fileHandler";
import {createChapterSchema} from "@/schema/chapter/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let chpater_id = content?.params?.id;

  if (!chpater_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.chapter.findFirst({
      where: {
        id: chpater_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        topics: true,
        course: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "chapter fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let chpater_id = content?.params.id;

  if (!chpater_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findUnique({
      where: {
        id: chpater_id,
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    data = await validateData(createChapterSchema, data);

    return await tx.chapter.update({
      data: data,
      where: {
        id: chpater_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "chapter updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let chpater_id = content?.params?.id;

  if (!chpater_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.count({
      where: {
        id: chpater_id,
      },
    });

    if (chapterFound === 0) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    return await tx.chapter.delete({
      where: {
        id: chpater_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "chapter deleted successfully",
      result,
    },
    { status: 200 }
  );
});
