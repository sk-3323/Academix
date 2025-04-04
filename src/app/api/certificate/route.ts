import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { decryptToken } from "@/lib/jwtGenerator";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (req: NextRequest, content: any) => {
  const data: any = await req.json();
  console.log(data, "data");

  const token: any = req.headers.get("x-user-token");
  const { id: userId } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    const certificateId = `CERT-${userId}-${Date.now().toString().slice(-6)}`;
    return await tx.certificate.create({
      data: {
        certificateId: certificateId,
        userId: userId,
        courseId: data.courseId,
      },
    });
  });
  return NextResponse.json(
    {
      message: "Certificate created successfully",
      result: result,
      status: true,
    },
    {
      status: 200,
    }
  );
});

export const GET = apiHandler(async (req: NextRequest, content: any) => {
  const searchParams = req.nextUrl.searchParams;
  const courseId = searchParams.get("courseId");
  const conditions: any = {};
  if (courseId) {
    conditions.courseId = courseId;
  }
  let result = await prisma.$transaction(async (tx) => {
    return await tx.certificate.findMany({
      where: conditions,
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
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
      message: "Certificate fetched successfully",
      result,
    },
    { status: 200 }
  );
});
