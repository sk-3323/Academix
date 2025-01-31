import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  hashPassword,
  validateData,
} from "../../../lib/utils";
import createUserSchema from "../../../../schema/user/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.user.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        courses: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "users fetched successfully",
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
      let avatar = formdata?.get("avatar") as File;
      data.password = await hashPassword(data?.password);

      data = await validateData(createUserSchema, data);

      if (avatar) {
        const { filePath, fileName } = await handleFileUpload(avatar);
        data.avatar = fileName;
        uploadedFilePath = filePath;
      }

      return await tx.user.create({
        data: data,
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "user created successfully",
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
