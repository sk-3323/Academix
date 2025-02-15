import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "../../../lib/fileHandler";
import { createResourceSchema } from "@/schema/resource/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.resource.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        chapter: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "resources fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let formdata = await request.formData();
  // let uploadedFilePath: string | null = null;
  try {
    let result = await prisma.$transaction(async (tx) => {
      let data = formDataToJsonWithoutFiles(formdata);
      // let url = formdata?.get("url") as File;
      // if (url) {
      //   const { filePath, fileName } = await handleFileUpload(
      //     url,
      //     COURSE_UPLOAD_PATH
      //   );
      //   data.url = fileName;
      //   data.title = fileName;
      //   uploadedFilePath = filePath;
      // }

      const chapterFound = await tx.chapter.findFirst({
        where: {
          id: data?.chapterId,
        },
        include: {
          resources: true,
          course: true,
        },
      });

      if (!chapterFound) {
        throw new ErrorHandler("Chapter not found", 404);
      }

      data = await validateData(createResourceSchema, data);

      return await prisma.resource.create({
        data: data,
        include: {
          chapter: true,
        },
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "resource created successfully",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    // if (uploadedFilePath) {
    //   cleanupUploadedFile(uploadedFilePath);
    // }
    throw error;
  }
});
