import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createUserProgressSchema from "@/schema/user-progress/schema";

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    let data = await request.json();

    let publishedTopic = await tx.topic.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        chapter: {
          courseId: data?.courseId,
          status: "PUBLISHED",
        },
        status: "PUBLISHED",
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedTopic.map((topic: any) => topic?.id);

    const validCompletedTopics = await tx.userProgress.count({
      orderBy: {
        id: "desc",
      },
      where: {
        userId: data?.userId,
        topicId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedTopics / publishedChapterIds?.length) * 100;
    return progressPercentage;
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "user-progress fetched successfully",
      result,
    },
    { status: 200 }
  );
});
