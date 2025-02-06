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
    });

    if (!topicFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    data = await validateData(changeTopicStatusSchema, data);

    return await tx.topic.update({
      data: data,
      where: {
        id: topic_id,
      },
    });
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
