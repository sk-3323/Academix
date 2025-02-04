import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "../../../lib/fileHandler";
import { createCourseSchema } from "../../../schema/course/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.course.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        instructor: true,
        category: true,
        chapters: true,
        certificates: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "courses fetched successfully",
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
      let thumbnail = formdata?.get("thumbnail") as File;

      data = await validateData(createCourseSchema, data);

      if (thumbnail) {
        const { filePath, fileName } = await handleFileUpload(
          thumbnail,
          COURSE_UPLOAD_PATH
        );
        data.thumbnail = fileName;
        uploadedFilePath = filePath;
      }

      return await tx.course.create({
        data: data,
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "course created successfully",
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
