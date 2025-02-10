import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeTopicOrderSchema } from "@/schema/topic/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let chapter_id = content?.params.chapterId;

  if (!chapter_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();
  data.chapterId = chapter_id;
  data = await validateData(changeTopicOrderSchema, data);

  let result = await prisma.$transaction(async (tx) => {
    const chapterFound = await tx.chapter.findUnique({
      where: {
        id: chapter_id,
      },
      include: {
        topics: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    let { topics } = data;

    let updatedTopics = await Promise.all(
      topics.map(async (topic: any) => {
        return await tx.topic.update({
          data: {
            order: topic?.order,
          },
          where: {
            id: topic?.id,
          },
        });
      })
    );

    return updatedTopics;
  });

  return NextResponse.json(
    {
      status: true,
      message: "Topics are reorderd",
      result,
    },
    { status: 200 }
  );
});
