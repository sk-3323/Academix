import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "@/lib/fileHandler";
import { ObjectId } from "mongodb";
import { createTopicSchema } from "@/schema/topic/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";
import path from "path";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let topic_id = content?.params?.id;

  if (!topic_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.topic.findFirst({
      where: {
        id: topic_id,
      },
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

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "topic fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let topic_id = content?.params.id;

  if (!topic_id || ObjectId.isValid(topic_id)) {
    throw new ErrorHandler("Not found", 404);
  }

  let formdata = await request.formData();
  let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      const topicFound = await tx.topic.findUnique({
        where: {
          id: topic_id,
        },
      });

      if (!topicFound) {
        throw new ErrorHandler("Topic not found", 404);
      }

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

      data = await validateData(createTopicSchema, data);

      let updatedTopic = await tx.topic.update({
        data: data,
        where: {
          id: topic_id,
        },
        include: {
          chapter: true,
          quiz: true,
          resources: true,
        },
      });

      if (updatedTopic && topicFound?.video) {
        let oldFilePath = path.join(
          path.resolve(process.cwd(), COURSE_UPLOAD_PATH),
          topicFound?.video
        );

        cleanupUploadedFile(oldFilePath);
      }
    });

    return NextResponse.json(
      {
        status: true,
        message: "topic updated successfully",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    if (uploadedFilePath) {
      cleanupUploadedFile(uploadedFilePath);
    }
    throw error;
  }
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let topic_id = content?.params?.id;

  if (!topic_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const topicFound = await tx.topic.count({
      where: {
        id: topic_id,
      },
    });

    if (topicFound === 0) {
      throw new ErrorHandler("Topic not found", 404);
    }

    return await tx.topic.delete({
      where: {
        id: topic_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "topic deleted successfully",
      result,
    },
    { status: 200 }
  );
});
