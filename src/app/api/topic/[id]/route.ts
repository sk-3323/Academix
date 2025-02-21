import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  createVideoAsset,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
  videoAsset,
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
        muxData: true,
        userProgress: true,
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

  if (!topic_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let formdata = await request.formData();
  // let uploadedFilePath: string | null = null;

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
      // let video = formdata?.get("video") as File;

      // if (video) {
      //   const { filePath, fileName } = await handleFileUpload(
      //     video,
      //     COURSE_UPLOAD_PATH
      //   );
      //   data.video = fileName;
      //   uploadedFilePath = filePath;
      // }

      data = await validateData(createTopicSchema, data);

      let updatedTopic = await tx.topic.update({
        data: data,
        where: {
          id: topic_id,
        },
        include: {
          chapter: true,
          quiz: true,
        },
      });

      if (updatedTopic?.video) {
        const muxDataFound = await tx.muxData.findUnique({
          where: {
            topicId: topicFound?.id,
          },
        });

        if (muxDataFound) {
          await tx.muxData.delete({
            where: {
              id: muxDataFound?.id,
            },
          });
          // THIS STEP WILL BE HERE IF MUX DATA API PREMIUM IS PURCHASED BECAUSE
          // IT AUTOMATICALLY REMOVED VIDEOS IN 24 HOURS

          // await videoAsset.assets.delete(muxDataFound?.assetId);
        }

        const asset = await createVideoAsset(updatedTopic?.video);

        await tx.muxData.create({
          data: {
            assetId: asset?.id,
            topicId: updatedTopic?.id,
            playbackId: asset?.playback_ids?.[0]?.id,
          },
        });
      }

      return updatedTopic;
      // if (updatedTopic && topicFound?.video) {
      //   let oldFilePath = path.join(
      //     path.resolve(process.cwd(), COURSE_UPLOAD_PATH),
      //     topicFound?.video
      //   );

      //   cleanupUploadedFile(oldFilePath);
      // }
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
    // if (uploadedFilePath) {
    //   cleanupUploadedFile(uploadedFilePath);
    // }
    throw error;
  }
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let topic_id = content?.params?.id;

  if (!topic_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const topicFound = await tx.topic.findFirst({
      where: {
        id: topic_id,
      },
      include: {
        chapter: true,
        quiz: true,
        muxData: true,
        userProgress: true,
      },
    });

    if (!topicFound) {
      throw new ErrorHandler("Topic not found", 404);
    }

    if (topicFound?.video && topicFound?.muxData?.assetId) {
      // THIS STEP WILL BE HERE IF MUX DATA API PREMIUM IS PURCHASED BECAUSE
      // IT AUTOMATICALLY REMOVED VIDEOS IN 24 HOURS
      // videoAsset.assets.delete(topicFound?.muxData?.assetId);
      await tx.muxData.delete({
        where: {
          id: topicFound?.muxData?.id,
        },
      });
    }

    let deletedTopic = await tx.topic.delete({
      where: {
        id: topic_id,
      },
      select: {
        id: true,
        chapterId: true,
      },
    });

    let updatedTopics = await tx.topic.findMany({
      where: {
        chapterId: deletedTopic?.chapterId,
        status: "PUBLISHED",
      },
      include: {
        chapter: true,
        quiz: true,
        muxData: true,
        userProgress: true,
      },
    });

    if (!updatedTopics?.length) {
      await tx.chapter.update({
        where: {
          id: deletedTopic?.chapterId,
        },
        data: {
          status: "DRAFT",
        },
      });
    }

    return deletedTopic;
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
