import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
} from "../../../../lib/fileHandler";
import createUserSchema from "@/schema/user/schema";
import path from "path";
import { USER_UPLOAD_PATH } from "@/constants/config";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let user_id = content?.params?.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.user.findFirst({
      where: {
        id: user_id,
      },
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
          },
        },
        subscriptionStatus: {
          include: {
            plan: true,
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
        UserProgress: {
          include: {
            topic: true,
          },
        },
      },
    });
  });

  if (!result) {
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

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let user_id = content?.params.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let formdata = await request.formData();
  let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      const userFound = await tx.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!userFound) {
        throw new ErrorHandler("User not found", 404);
      }

      let data = formDataToJsonWithoutFiles(formdata);
      let avatar = formdata?.get("avatar") as File;

      data = await validateData(createUserSchema, data);

      if (avatar) {
        const { filePath, fileName } = await handleFileUpload(
          avatar,
          USER_UPLOAD_PATH
        );
        data.avatar = fileName;
        uploadedFilePath = filePath;
      }

      let updatedUser = await tx.user.update({
        data: data,
        where: {
          id: user_id,
        },
      });

      if (updatedUser && userFound?.avatar) {
        let oldFilePath = path.join(
          path.resolve(process.cwd(), USER_UPLOAD_PATH),
          userFound?.avatar
        );

        cleanupUploadedFile(oldFilePath);
      }
    });

    return NextResponse.json(
      {
        status: true,
        message: "user updated successfully",
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
  let user_id = content?.params?.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const userFound = await tx.user.count({
      where: {
        id: user_id,
      },
    });

    if (userFound === 0) {
      throw new ErrorHandler("User not found", 404);
    }

    return await tx.user.delete({
      where: {
        id: user_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "users deleted successfully",
      result,
    },
    { status: 200 }
  );
});
