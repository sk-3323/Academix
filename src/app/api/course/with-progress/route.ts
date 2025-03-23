import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import { createCourseWithProgressSchema } from "@/schema/course/schema";
import { CourseWithProgressWithCategory } from "../../../../../types/Course";

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    let requiredFields = request?.nextUrl?.searchParams;
    data = await validateData(
      createCourseWithProgressSchema,
      data,
      requiredFields
    );
    let courses = await tx.course.findMany({
      where: {
        status: "PUBLISHED",
        title: {
          contains: data?.title,
        },
        categoryId: data?.categoryId,
      },
      include: {
        chapters: {
          where: {
            status: "PUBLISHED",
          },
          include: {
            topics: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        instructor: true,
        enrollments: {
          where: {
            userId: data?.userId,
            status: {
              not: "DROPPED",
            },
            payment_status: "PAID",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const courseWtihProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses?.map(async (course: any) => {
          if (course?.enrollments?.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(
            data?.userId,
            course?.id
          );
          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return courseWtihProgress;
  });

  return NextResponse.json(
    {
      status: true,
      message: "courses fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");
  try {
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    const progress = await getProgress(userId, courseId);

    return NextResponse.json({ progress });
  } catch (error) {
    console.log(error);
  }
}

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    let result = await prisma.$transaction(async (tx) => {
      let publishedTopic = await tx.topic.findMany({
        orderBy: {
          id: "desc",
        },
        where: {
          chapter: {
            courseId: courseId,
            status: "PUBLISHED",
          },
          status: "PUBLISHED",
        },
        select: {
          id: true,
        },
      });

      const publishedChapterIds = publishedTopic.map((topic: any) => topic?.id);

      const validCompletedTopics = await tx.userProgress.count({
        orderBy: {
          id: "desc",
        },
        where: {
          userId: userId,
          topicId: {
            in: publishedChapterIds,
          },
          isCompleted: true,
        },
      });

      const progressPercentage =
        (validCompletedTopics / publishedChapterIds?.length) * 100;
      return progressPercentage;
    });

    if (!result) {
      return 0;
    }

    return result;
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};
