import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/helpers/receiptSendMail";

export interface paymentDataType {
  receipt_number: string | null;
  user_name: string;
  user_email: string;
  course_title: string;
  amount: number | null;
  payment_id: string | null;
  order_id: string | null;
  date: any;
}
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

      // Replace createMany with individual create calls
      await tx.transaction.create({
        data: {
          type: "CREDIT",
          amount: adminAmt,
          status: "COMPLETED",
          description: `₹${adminAmt.toFixed(2)} paid for the purchase of the course "${enrollemnt?.course?.title}" by ${enrollemnt?.user?.username}.`,
          paymentMethod: "RAZORPAY",
          userId: adminData?.id!,
          courseId: enrollemnt?.courseId,
        },
      });

      await tx.transaction.create({
        data: {
          type: "CREDIT",
          amount: TeacherAmt,
          status: "COMPLETED",
          description: `₹${TeacherAmt.toFixed(2)} paid for the purchase of the course "${enrollemnt?.course?.title}" by ${enrollemnt?.user?.username}.`,
          paymentMethod: "RAZORPAY",
          userId: enrollemnt?.course?.instructorId!,
          courseId: enrollemnt?.course?.id,
        },
      });

      await tx.user.update({
        data: { wallet_balance: { increment: adminAmt } },
        where: { id: adminData?.id },
      });

      await tx.user.update({
        data: { wallet_balance: { increment: TeacherAmt } },
        where: { id: enrollemnt?.course?.instructorId },
      });
    }
    const receiptData: paymentDataType = {
      receipt_number: enrollemnt.receipt,
      user_name: enrollemnt.user.username,
      user_email: enrollemnt.user.email,
      course_title: enrollemnt.course.title,
      amount: enrollemnt.price,
      payment_id: enrollemnt.razorpay_payment_id,
      order_id: enrollemnt.razorpay_order_id,
      date: new Date().toLocaleString(),
    };
    if (!enrollemnt.user.email) {
      new ErrorHandler("Email not found");
    }
    await sendReceiptEmail(receiptData);
    return enrollemnt;
  });
  return NextResponse.json(
    {
      status: true,
      message: "Enrollment successful. Please check your email",
      result,
    },
    { status: 200 }
  );
});
