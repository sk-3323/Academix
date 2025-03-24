import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formDataToJsonWithoutFiles, validateData } from "@/lib/fileHandler";

import { createResourceSchema } from "@/schema/resource/schema";
import { utapi } from "@/lib/utAPI";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let resource_id = content?.params?.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    return await tx.resource.findFirst({
      where: {
        id: resource_id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        chapter: true,
      },
    });
  });

  if (!result) {
    throw new ErrorHandler("No data found", 404);
  }

  return NextResponse.json(
    {
      status: true,
      message: "resource fetched successfully",
      result,
    },
    { status: 200 }
  );
});

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let resource_id = content?.params.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 404);
  }

  let formdata = await request.formData();
  let uploadedFileKey: string | null = null;

  try {
    const resourceFound = await prisma.resource.findUnique({
      where: {
        id: resource_id,
      },
    });

    if (!resourceFound) {
      throw new ErrorHandler("Resource not found", 404);
    }

    let data = formDataToJsonWithoutFiles(formdata);
    let url = formdata?.get("url") as File;

    if (url) {
      const uploadedFile = await utapi.uploadFiles(url);
      data.url = uploadedFile?.data?.url;
      data.publicKey = uploadedFile?.data?.key;
      uploadedFileKey = uploadedFile?.data?.key || null;
    }

    data = await validateData(createResourceSchema, data);
    let result = await prisma.$transaction(async (tx) => {
      let updatedResource = await tx.resource.update({
        data: data,
        where: {
          id: resource_id,
        },
        include: {
          chapter: true,
        },
      });

      if (updatedResource && resourceFound?.publicKey) {
        await utapi.deleteFiles(resourceFound?.publicKey); // Cleanup if an error
      }

      return updatedResource;
    });

    return NextResponse.json(
      {
        status: true,
        message: "resource updated successfully",
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
  let resource_id = content?.params?.id;

  if (!resource_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    const resourceFound = await tx.resource.findFirst({
      where: {
        id: resource_id,
      },
      include: {
        chapter: true,
      },
    });

    if (!resourceFound) {
      throw new ErrorHandler("Resource not found", 404);
    }

    let deletedResource = await tx.resource.delete({
      where: {
        id: resource_id,
      },
      select: {
        id: true,
        chapterId: true,
        publicKey: true,
      },
    });

    if (deletedResource?.publicKey) {
      await utapi.deleteFiles(deletedResource?.publicKey); // Cleanup if an error
    }

    return deletedResource;
  });

  return NextResponse.json(
    {
      status: true,
      message: "resource deleted successfully",
      result,
    },
    { status: 200 }
  );
});
