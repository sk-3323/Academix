import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "../../../lib/fileHandler";
import { COURSE_UPLOAD_PATH } from "@/constants/config";
import { decryptToken } from "@/lib/jwtGenerator";
import { createCourseSchema } from "@/schema/course/schema";
import { isAuthorized } from "@/lib/roleChecker";
import { Key } from "lucide-react";

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
  let token: any = request.headers.get("x-user-token");
  let { id: instructorId, ...session } = await decryptToken(token);

  if (!token || !instructorId) {
    throw new ErrorHandler("Unauthorized : invalid or empty token", 401);
  }

  isAuthorized(session, "TEACHER");

  let formdata = await request.formData();
  let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      let data = formDataToJsonWithoutFiles(formdata);
      data.instructorId = instructorId;
      let thumbnail = formdata?.get("thumbnail") as File;

      if (thumbnail) {
        const { filePath, fileName } = await handleFileUpload(
          thumbnail,
          COURSE_UPLOAD_PATH
        );
        data.thumbnail = fileName;
        uploadedFilePath = filePath;
      }

      let requiredFields = request?.nextUrl?.searchParams;

      data = await validateData(createCourseSchema, data, requiredFields);

      return await tx.course.create({
        data: data,
      });
      return null;
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
