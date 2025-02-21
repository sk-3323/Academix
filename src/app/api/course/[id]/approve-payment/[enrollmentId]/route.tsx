import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

export const PUT = apiHandler(async (request: NextRequest, content: any) => {
  let enrollment_id = content?.params?.enrollmentId;
  let { razorpay_payment_id, razorpay_order_id, razorpay_signature }: any =
    request.json();
  if (!enrollment_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let result = await prisma.$transaction(async (tx) => {
    let enrollmentFound = await tx.enrollment.findUnique({
      where: {
        id: enrollment_id,
      },
    });

    if (!enrollmentFound) {
      throw new ErrorHandler("You are nor enrolled in this course", 400);
    }

    let data: any = {
      status: "ACTIVE",
      payment_status: "PAID",
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    };

    return await tx.enrollment.update({
      data: data,
      where: {
        id: enrollmentFound?.id,
      },
    });
  });

  return NextResponse.json(
    {
      status: true,
      message: "Enrollment successfull.",
      result,
    },
    { status: 200 }
  );
});
