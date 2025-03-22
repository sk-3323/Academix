import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

function splitAmount(amount: number) {
  let TeacherAmt = amount * 0.8;
  let adminAmt = amount * 0.2;
  return { adminAmt, TeacherAmt };
}

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
      throw new ErrorHandler("You are not enrolled in this course", 400);
    }

    let data: any = {
      status: "ACTIVE",
      payment_status: "PAID",
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    };

    let enrollemnt = await tx.enrollment.update({
      data: data,
      where: {
        id: enrollmentFound?.id,
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        user: true,
      },
    });

    let adminData = await tx.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (!enrollemnt?.course?.isFree) {
      const { adminAmt, TeacherAmt } = splitAmount(enrollemnt?.price!);
      await tx.transaction.createMany({
        data: [
          {
            type: "CREDIT",
            amount: adminAmt,
            status: "COMPLETED",
            description: `₹${adminAmt.toFixed(2)} paid for the purchase of the course "${enrollemnt?.course?.title}" by ${enrollemnt?.user?.username}.`,
            paymentMethod: "RAZORPAY",
            userId: adminData?.id!,
            courseId: enrollemnt?.courseId,
          },
          {
            type: "CREDIT",
            amount: TeacherAmt,
            status: "COMPLETED",
            description: `₹${TeacherAmt.toFixed(2)} paid for the purchase of the course "${enrollemnt?.course?.title}" by ${enrollemnt?.user?.username}.`,
            paymentMethod: "RAZORPAY",
            userId: enrollemnt?.course?.instructorId!,
            courseId: enrollemnt?.course?.id,
          },
        ],
      });

      await tx.user.update({
        data: {
          wallet_balance: {
            increment: adminAmt,
          },
        },
        where: {
          id: adminData?.id,
        },
      });
      
      await tx.user.update({
        data: {
          wallet_balance: {
            increment: TeacherAmt,
          },
        },
        where: {
          id: enrollemnt?.course?.instructorId,
        },
      });

      return enrollemnt;
    }
  });

  return NextResponse.json(
    {
      status: true,
      message: "Enrollment successful.",
      result,
    },
    { status: 200 }
  );
});
