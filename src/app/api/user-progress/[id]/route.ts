import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createUserProgressSchema from "@/schema/user-progress/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let userProgress_id = content?.params?.id;

  if (!userProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.userProgress.findFirst({
      where: {
        id: userProgress_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        topic: true,
        user: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "user progress fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let userProgress_id = content?.params.id;

  if (!userProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const userProgressFound = await tx.userProgress.findUnique({
      where: {
        id: userProgress_id,
      },
    });

    if (!userProgressFound) {
      throw new ErrorHandler("User progress not found", 404);
    }

    let data = await request.json();

    data = await validateData(createUserProgressSchema, data);

    return await tx.userProgress.update({
      data: data,
      where: {
        id: userProgress_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user progress updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let userProgress_id = content?.params?.id;

  if (!userProgress_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const userProgressFound = await tx.userProgress.count({
      where: {
        id: userProgress_id,
      },
    });

    if (userProgressFound === 0) {
      throw new ErrorHandler("User progress not found", 404);
    }

    return await tx.userProgress.delete({
      where: {
        id: userProgress_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user progress deleted successfully",
      result,
    },
    { status: 200 }
  );
});
