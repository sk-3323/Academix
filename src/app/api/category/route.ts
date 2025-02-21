import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "@/lib/fileHandler";
import createCategorySchema from "@/schema/category/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.category.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        course: true,
      },
    });
  });

  if (result?.length === 0) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "categories fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let data = await request.json();

  let result = await prisma.$transaction(async (tx) => {
    data = await validateData(createCategorySchema, data);

    return await tx.category.create({
      data: data,
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "category created successfully",
      result,
    },
    { status: 201 }
  );
});
