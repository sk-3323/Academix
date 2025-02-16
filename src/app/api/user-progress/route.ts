import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createUserProgressSchema from "@/schema/user-progress/schema";

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

  let result = await prisma.$transaction(async (tx) => {
    data = await validateData(createUserProgressSchema, data);

    return await tx.userProgress.create({
      data: data,
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "user-progress created successfully",
      result,
    },
    { status: 201 }
  );
});
