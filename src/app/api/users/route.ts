import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formDataToJsonWithoutFiles } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import createUserSchema from "../../../../schema/user/schema";
import bcrypt from "bcrypt";

export const GET = apiHandler(async (request: NextRequest, content: any) => {
  let result = await prisma.$transaction(async (tx) => {
    return await tx.user.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        courses: true,
      },
    });
  });

  if (result?.length === 0) {
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
  let uploadedFilePath: string | null = null;

  try {
    let result = await prisma.$transaction(async (tx) => {
      let data = formDataToJsonWithoutFiles(formdata);
      let avatar = formdata?.get("avatar") as File;
      data.password = await bcrypt.hash(data?.password, 10);

      let valid = createUserSchema.safeParse(data);

      if (!valid.success) {
        console.log(valid.error.errors);
        let errors = valid.error.errors.map((x) => x.message);
        throw new ErrorHandler(
          `Validation errors :>> ${errors.join(", ")}`,
          400
        );
      }

      if (avatar) {
        try {
          const uniqueFileName = `${Date.now()}-${avatar.name}`;
          const uploadPath = path.join(
            path.resolve(process.cwd(), "uploads/images"),
            uniqueFileName
          );
          const buffer = await avatar.arrayBuffer();
          const avatarBuffer = Buffer.from(buffer);
          await fs.writeFileSync(uploadPath, avatarBuffer);
          uploadedFilePath = uploadPath;
          data.avatar = uniqueFileName;
        } catch (error: any) {
          throw new ErrorHandler(error?.message, 500);
        }
      }

      return await tx.user.create({
        data: data,
      });
    });

    return NextResponse.json(
      {
        status: true,
        message: "user created successfully",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (uploadedFilePath) {
      try {
        await fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError: any) {
        console.error("Failed to cleanup uploaded file:", cleanupError);
        throw new ErrorHandler(cleanupError.message, 500);
      }
    }
    throw error;
  }
});
