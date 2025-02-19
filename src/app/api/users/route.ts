import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  hashPassword,
  validateData,
} from "../../../lib/fileHandler";
import createUserSchema from "@/schema/user/schema";
import { USER_UPLOAD_PATH } from "@/constants/config";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.user.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        authoredCourses: {
          include: {
            category: true,
            enrollments: {
              include: {
                user: true,
              },
            },
            chapters: {
              include: {
                topics: {
                  include: {
                    muxData: true,
                    userProgress: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          include: {
            user: true,
            course: {
              include: {
                instructor: true,
                category: true,
                chapters: {
                  where: {
                    status: "PUBLISHED",
                  },
                  include: {
                    resources: true,
                    topics: {
                      where: {
                        status: "PUBLISHED",
                      },
                      include: {
                        muxData: true,
                        userProgress: true,
                      },
                      orderBy: {
                        order: "asc",
                      },
                    },
                  },
                  orderBy: {
                    order: "asc",
                  },
                },
                certificates: true,
              },
            },
          },
          where: {
            status: {
              not: "DROPPED",
            },
            payment_status: "PAID",
          },
        },
        subscriptionStatus: {
          include: {
            plan: true,
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
        const { filePath, fileName } = await handleFileUpload(
          avatar,
          USER_UPLOAD_PATH
        );
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
