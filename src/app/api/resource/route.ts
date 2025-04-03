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
import { utapi } from "@/lib/utAPI";

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
  let uploadedFileKey: string | null = null;

  try {
    // Convert form data to JSON, excluding files
    let data = formDataToJsonWithoutFiles(formdata);

    // Find the chapter
    const chapterFound = await prisma.chapter.findFirst({
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

    // Validate the data against the schema
    data = await validateData(createResourceSchema, data);

    // Handle file upload
    const url = formdata?.get("url");

    // Create the resource in a transaction
    const result = await prisma.$transaction(async (tx) => {
      return await tx.resource.create({
        data: data,
        include: {
          chapter: true,
        },
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "Resource created successfully",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    // Cleanup uploaded file if it exists
    if (uploadedFileKey) {
      await utapi.deleteFiles(uploadedFileKey);
    }
    throw error; // Let the apiHandler handle the error response
  }
});
