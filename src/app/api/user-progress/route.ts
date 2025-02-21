import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createUserProgressSchema from "@/schema/user-progress/schema";
import { decryptToken } from "@/lib/jwtGenerator";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.userProgress.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        topic: true,
        user: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "user-progress fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();
  let token: any = request.headers.get("x-user-token");
  let { id: userId } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    data = await validateData(createUserProgressSchema, data);

    return await tx.userProgress.upsert({
      where: {
        userId_topicId: {
          userId: userId,
          topicId: data?.topicId,
        },
      },
      update: {
        isCompleted: data?.isCompleted,
      },
      create: {
        userId: userId,
        topicId: data?.topicId,
        isCompleted: data?.isCompleted,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: data?.isCompleted
        ? "Marked as complete"
        : "Marked as incomplete",
      result,
    },
    { status: 201 }
  );
});
