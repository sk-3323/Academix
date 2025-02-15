import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData, videoAsset } from "@/lib/fileHandler";
import { createChapterSchema } from "@/schema/chapter/schema";
import { ObjectId } from "mongodb";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let chapter_id = content?.params?.id;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.chapter.findFirst({
      where: {
        id: chapter_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        topics: {
          orderBy: {
            order: "asc",
          },
        },
        resources: {
          orderBy: {
            createdAt: "desc",
          },
        },
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
  let chapter_id = content?.params.id;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let data = await request.json();
  data = await validateData(createChapterSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findUnique({
      where: {
        id: chapter_id,
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

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

    return await tx.chapter.update({
      data: data,
      where: {
        id: chapter_id,
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
  let chapter_id = content?.params?.id;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findFirst({
      where: {
        id: chapter_id,
      },
      include: {
        topics: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    for (let topic of chapterFound?.topics) {
      if (topic?.muxData?.assetId) {
        console.log("aave aave aave :>>");
        await videoAsset.assets.delete(topic?.muxData?.assetId);
      }
    }

    return await tx.chapter.delete({
      where: {
        id: chapter_id,
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
