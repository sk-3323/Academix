import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { createCourseSchema } from "@/schema/course/schema";
import { COURSE_UPLOAD_PATH } from "@/constants/config";
import {
  cleanupUploadedFile,
  formDataToJsonWithoutFiles,
  handleFileUpload,
  validateData,
  videoAsset,
} from "@/lib/fileHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { getProgress } from "../with-progress/route";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params?.id;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: instructorId, ...session } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    return await tx.course.findFirst({
      where: {
        id: course_id,
        instructorId: instructorId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        instructor: true,
        category: true,
        chapters: {
          orderBy: {
            order: "asc",
          },
        },
        certificates: true,
      },
    });
  });

  if (!result) {
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
  let course_id = content?.params?.id;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: userId } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    let course: any = await tx.course.findFirst({
      where: {
        id: course_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        enrollments: {
          where: {
            userId: userId,
            status: {
              not: "DROPPED",
            },
            payment_status: "PAID",
          },
        },
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
                userProgress: {
                  where: {
                    userId: userId,
                  },
                },
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
    });

    let progressCount = await getProgress(userId, course?.id!);

    return { ...course, progressCount };
  });

  if (!result) {
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

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params.id;

  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let formdata = await request.formData();
  // let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      const courseFound = await tx.course.findUnique({
        where: {
          id: course_id,
        },
      });

      if (!courseFound) {
        throw new ErrorHandler("Course not found", 404);
      }

      let data = formDataToJsonWithoutFiles(formdata);
      // let thumbnail = formdata?.get("thumbnail") as File;

      data = await validateData(createCourseSchema, data);

      // if (thumbnail) {
      //   const { filePath, fileName } = await handleFileUpload(
      //     thumbnail,
      //     COURSE_UPLOAD_PATH
      //   );
      //   data.thumbnail = fileName;
      //   uploadedFilePath = filePath;
      // }

      let updatedCourse = await tx.course.update({
        data: data,
        where: {
          id: course_id,
        },
        include: {
          chapters: {
            orderBy: {
              order: "asc",
            },
          },
          category: true,
        },
      });

      // if (updatedCourse && courseFound?.thumbnail) {
      //   let oldFilePath = path.join(
      //     path.resolve(process.cwd(), COURSE_UPLOAD_PATH),
      //     courseFound?.thumbnail
      //   );

      //   cleanupUploadedFile(oldFilePath);
      // }

      return updatedCourse;
    });

    return NextResponse.json(
      {
        status: true,
        message: "course updated successfully",
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
  let course_id = content?.params?.id;

  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const courseFound = await tx.course.findFirst({
      where: {
        id: course_id,
      },
      include: {
        chapters: {
          select: {
            topics: {
              select: {
                muxData: true,
              },
            },
          },
        },
      },
    });

    if (!courseFound) {
      throw new ErrorHandler("Course not found", 404);
    }

    for (let chapter of courseFound?.chapters) {
      for (let topic of chapter?.topics) {
        if (topic?.muxData?.assetId) {
          await videoAsset.assets.delete(topic?.muxData?.assetId);
        }
      }
    }

    return await tx.course.delete({
      where: {
        id: course_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "courses deleted successfully",
      result,
    },
    { status: 200 }
  );
});
