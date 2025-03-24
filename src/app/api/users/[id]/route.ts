import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formDataToJsonWithoutFiles, validateData } from "../../../../lib/fileHandler";
import { utapi } from "@/lib/utAPI";
import createUserSchema from "@/schema/user/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  const user_id = content?.params?.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
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
  const user_id = content?.params.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }
  const formdata = await request.formData();
  let uploadedFileKey: string | null = null;

  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!userFound) {
      throw new ErrorHandler("User not found", 404);
    }

    let data = formDataToJsonWithoutFiles(formdata);
    const avatar = formdata?.get("avatar") as File;

    // data.isBlocked = data.isBlocked === "true" || data.isBlocked === true;
    data = await validateData(createUserSchema, data);

    if (avatar) {
      const uploadedFile = await utapi.uploadFiles(avatar);
      data.avatar = uploadedFile?.data?.url;
      data.avatarKey = uploadedFile?.data?.key;
      uploadedFileKey = uploadedFile?.data?.key || null;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        data: data,
        where: {
          id: user_id,
        },
      });

      if (updatedUser && userFound?.avatarKey) {
        await utapi.deleteFiles(userFound?.avatarKey); // Cleanup if an error
      }

      return updatedUser;
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
    if (uploadedFileKey) {
      await utapi.deleteFiles(uploadedFileKey); // Cleanup if an error
    }
    throw error;
  }
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  const user_id = content?.params?.id;

  if (!user_id) {
    throw new ErrorHandler("Not found", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const userFound = await tx.user.count({
      where: {
        id: user_id,
      },
    });

    if (userFound === 0) {
      throw new ErrorHandler("User not found", 404);
    }

    const deletedUser = await tx.user.delete({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        avatarKey: true,
      },
    });

    if (deletedUser?.avatarKey) {
      await utapi.deleteFiles(deletedUser?.avatarKey); // Cleanup if an error
    }

    return deletedUser;
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
