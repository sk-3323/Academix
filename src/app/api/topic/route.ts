import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formDataToJsonWithoutFiles,
  validateData,
} from "../../../lib/fileHandler";
import { createTopicSchema } from "@/schema/topic/schema";
import { utapi } from "@/lib/utAPI";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.topic.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        chapter: true,
        muxData: true,
        userProgress: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "topics fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let formdata = await request.formData();
  let uploadedFileKey: string | null = null;
  try {
    let data = formDataToJsonWithoutFiles(formdata);
    let video = formdata?.get("video") as File;
    if (video) {
      const uploadedFile = await utapi.uploadFiles(video);
      data.video = uploadedFile?.data?.url;
      data.videoKey = uploadedFile?.data?.key;
      uploadedFileKey = uploadedFile?.data?.key || null;
    }

    const chapterFound = await prisma.chapter.findFirst({
      where: {
        id: data?.chapterId,
      },
      include: {
        topics: true,
        course: true,
      },
    });

    if (!chapterFound) {
      throw new ErrorHandler("Chapter not found", 404);
    }

    let lastTopic = await prisma.topic.findFirst({
      where: {
        chapterId: chapterFound?.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    data.order = lastTopic?.order ? lastTopic?.order + 1 : 1;

    data = await validateData(createTopicSchema, data);

    let result = await prisma.$transaction(async (tx) => {
      return await tx.topic.create({
        data: data,
        include: {
          chapter: true,
        },
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "topic created successfully",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (uploadedFileKey) {
      await utapi.deleteFiles(uploadedFileKey); // Cleanup if an error occurs
    }
    throw error;
  }
});
