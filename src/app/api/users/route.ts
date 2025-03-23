import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formDataToJsonWithoutFiles,
  hashPassword,
  validateData,
} from "../../../lib/fileHandler";
import createUserSchema from "@/schema/user/schema";
import { utapi } from "@/lib/utAPI";

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
  console.log(result, "retulr");

  if (result?.length == 0 || result === null) {
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
  let uploadedFileKey: string | null = null;

  try {
    let data = formDataToJsonWithoutFiles(formdata);
    let avatar = formdata?.get("avatar") as File;
    data.password = await hashPassword(data?.password);

    // Validate data BEFORE transaction
    data = await validateData(createUserSchema, data);
    data.isVerified = true;

    console.log("result", data);
    // Upload the avatar BEFORE transaction
    if (avatar) {
      const uploadedFile = await utapi.uploadFiles(avatar);
      data.avatar = uploadedFile?.data?.url;
      data.avatarKey = uploadedFile?.data?.key;
      uploadedFileKey = uploadedFile?.data?.key || null;
    }

    // Now run the transaction with ONLY database operations
    let result = await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: data,
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "User created successfully",
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
