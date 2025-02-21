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
import { createResourceSchema } from "@/schema/resource/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";
import path from "path";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let resource_id = content?.params?.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.resource.findFirst({
      where: {
        id: resource_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        chapter: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "resource fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let resource_id = content?.params.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let formdata = await request.formData();
  // let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      const resourceFound = await tx.resource.findUnique({
        where: {
          id: resource_id,
        },
      });

      if (!resourceFound) {
        throw new ErrorHandler("Resource not found", 404);
      }

      let data = formDataToJsonWithoutFiles(formdata);
      // let url = formdata?.get("url") as File;

      // if (url) {
      //   const { filePath, fileName } = await handleFileUpload(
      //     url,
      //     COURSE_UPLOAD_PATH
      //   );
      //   data.url = fileName;
      //   uploadedFilePath = filePath;
      // }

      data = await validateData(createResourceSchema, data);

      let updatedResource = await tx.resource.update({
        data: data,
        where: {
          id: resource_id,
        },
        include: {
          chapter: true,
        },
      });

      return updatedResource;
      // if (updatedResource && resourceFound?.video) {
      //   let oldFilePath = path.join(
      //     path.resolve(process.cwd(), COURSE_UPLOAD_PATH),
      //     resourceFound?.video
      //   );

      //   cleanupUploadedFile(oldFilePath);
      // }
    });

    return NextResponse.json(
      {
        status: true,
        message: "resource updated successfully",
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
  let resource_id = content?.params?.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const resourceFound = await tx.resource.findFirst({
      where: {
        id: resource_id,
      },
      include: {
        chapter: true,
      },
    });

    if (!resourceFound) {
      throw new ErrorHandler("Resource not found", 404);
    }

    let deletedResource = await tx.resource.delete({
      where: {
        id: resource_id,
      },
      select: {
        id: true,
        chapterId: true,
      },
    });

    return deletedResource;
  });

  return NextResponse.json(
    {
      status: true,
      message: "resource deleted successfully",
      result,
    },
    { status: 200 }
  );
});
