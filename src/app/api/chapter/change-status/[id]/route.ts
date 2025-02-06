import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeChapterStatusSchema } from "@/schema/chapter/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let chapter_id = content?.params.id;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findUnique({
      where: {
        id: chapter_id,
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    data = await validateData(changeChapterStatusSchema, data);

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
      message:
        result?.status === "DRAFT"
          ? "chapter has sent to draft"
          : "chapter has been published",
      result,
    },
    { status: 200 }
  );
});
