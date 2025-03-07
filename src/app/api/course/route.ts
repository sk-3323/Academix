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
import { utapi } from "@/lib/utAPI";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let token: any = request.headers.get("x-user-token");
  let { id, isAdmin } = await decryptToken(token);

  const searchParams = request.nextUrl.searchParams;
  let conditions: any = {};

  const instructorId = searchParams.get("instructorId");

  if (instructorId) {
    if (!isAdmin && id !== instructorId) {
      throw new ErrorHandler("Forbidden Access", 403);
    }
    conditions.instructorId = instructorId;
  }

  const status = searchParams.get("status");

  if (status) {
    conditions.status = status;
  }

  const categoryId = searchParams.get("categoryId");

  if (categoryId) {
    conditions.categoryId = categoryId;
  }

  const isFree = searchParams.get("isFree");

  if (isFree) {
    conditions.isFree = isFree;
  }

  const from_price = searchParams.get("from_price");
  const to_price = searchParams.get("to_price");

  if (from_price && to_price) {
    conditions.price = {
      gte: from_price,
      lte: to_price,
    };
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.course.findMany({
      where: conditions,
      orderBy: {
        id: "desc",
      },
      include: {
        instructor: true,
        category: true,
        chapters: true,
        certificates: true,
        enrollments: {
          include: {
            user: true,
          },
        },
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
  let session = await decryptToken(token);
  let { id: instructorId } = session;

  if (!token || !instructorId) {
    throw new ErrorHandler("Unauthorized : invalid or empty token", 401);
  }

  // isAuthorized(session, "TEACHER");

  let formdata = await request.formData();
  let uploadedFileKey: string | null = null;

  try {
    let data = formDataToJsonWithoutFiles(formdata);
    data.instructorId = instructorId;
    let thumbnail = formdata?.get("thumbnail") as File;

    if (thumbnail) {
      const uploadedFile = await utapi.uploadFiles(thumbnail);
      data.thumbnail = uploadedFile?.data?.url;
      data.thumbnailKey = uploadedFile?.data?.key;
      uploadedFileKey = uploadedFile?.data?.key || null;
    }

    let requiredFields = request?.nextUrl?.searchParams;

    data = await validateData(createCourseSchema, data, requiredFields);

    let result = await prisma.$transaction(async (tx) => {
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
    if (uploadedFileKey) {
      await utapi.deleteFiles(uploadedFileKey); // Cleanup if an error occurs
    }
    throw error;
  }
});
