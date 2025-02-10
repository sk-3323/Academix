import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "../../../lib/fileHandler";
import { createTopicSchema } from "@/schema/topic/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.topic.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        chapter: true,
        quiz: true,
        resources: true,
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
  let uploadedFilePath: string | null = null;
  try {
    let result = await prisma.$transaction(async (tx) => {
      let data = formDataToJsonWithoutFiles(formdata);
      let video = formdata?.get("video") as File;
      if (video) {
        const { filePath, fileName } = await handleFileUpload(
          video,
          COURSE_UPLOAD_PATH
        );
        data.video = fileName;
        uploadedFilePath = filePath;
      }

      const chapterFound = await tx.chapter.findFirst({
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

      return await prisma.topic.create({
        data: data,
        include: {
          chapter: true,
          quiz: true,
          resources: true,
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
    if (uploadedFilePath) {
      cleanupUploadedFile(uploadedFilePath);
    }
    throw error;
  }
});
