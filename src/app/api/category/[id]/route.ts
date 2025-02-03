import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateData } from "../../../../lib/fileHandler";
import createCategorySchema from "../../../../schema/category/schema";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let category_id = content?.params?.id;

  if (!category_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.category.findFirst({
      where: {
        id: category_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        course: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "category fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let category_id = content?.params.id;

  if (!category_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const categoryFound = await tx.category.findUnique({
      where: {
        id: category_id,
      },
    });

    if (!categoryFound) {
      throw new ErrorHandler("Category not found", 404);
    }

    let data = await request.json();

    data = await validateData(createCategorySchema, data);

    return await tx.category.update({
      data: data,
      where: {
        id: category_id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "category updated successfully",
      result,
    },
    { status: 200 }
  );
});

export const DELETE = apiHandler(async (request: NextRequest, content: any) => {
  let category_id = content?.params?.id;

  if (!category_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const categoryFound = await tx.category.count({
      where: {
        id: category_id,
      },
    });

    if (categoryFound === 0) {
      throw new ErrorHandler("Category not found", 404);
    }

    return await tx.category.delete({
      where: {
        id: category_id,
      },
      select: {
        id: true,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "category deleted successfully",
      result,
    },
    { status: 200 }
  );
});
