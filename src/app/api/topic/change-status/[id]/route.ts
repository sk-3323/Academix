import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { changeTopicStatusSchema } from "@/schema/topic/schema";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let topic_id = content?.params.id;

  if (!topic_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    const topicFound = await tx.topic.findUnique({
      where: {
        id: topic_id,
      },
      include: {
        muxData: true,
      },
    });

    if (!topicFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    if (
      !topicFound?.title ||
      !topicFound?.description ||
      !topicFound?.video ||
      !topicFound?.muxData
    ) {
      throw new ErrorHandler("Missing fields are required!", 400);
    }

    data = await validateData(changeTopicStatusSchema, data);

    let updatedTopic = await tx.topic.update({
      data: data,
      where: {
        id: topic_id,
      },
    });

    let updatedTopicFound = await tx.topic.findMany({
      where: {
        id: topic_id,
        status: "PUBLISHED",
      },
    });

    if (!updatedTopicFound?.length) {
      await tx.chapter.update({
        data: {
          status: "DRAFT",
        },
        where: {
          id: updatedTopic?.chapterId,
        },
      });
    }

    return updatedTopic;
  });

  return NextResponse.json(
    {
      status: true,
      message:
        result?.status === "DRAFT"
          ? "topic has sent to draft"
          : "topic has been published",
      result,
    },
    { status: 200 }
  );
});
