import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, razorpay } from "@/lib/razorpay";
import { decryptToken } from "@/lib/jwtGenerator";

export const POST = apiHandler(async (request: NextRequest, content: any) => {
  let course_id = content?.params?.id;
  if (!course_id) {
    throw new ErrorHandler("Not found", 400);
  }

  let token: any = request.headers.get("x-user-token");
  let { id: userId, ...session } = await decryptToken(token);

  let result = await prisma.$transaction(async (tx) => {
    let course = await tx.course.findFirst({
      where: {
        id: course_id,
        status: "PUBLISHED",
      },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new ErrorHandler("Course Not found", 400);
    }

    let enrollmentFound = await tx.enrollment.findUnique({
      where: {
        userId_courseId: {
          courseId: course_id,
          userId: userId,
        },
      },
    });

    let data: any = {
      status: "ACTIVE",
      payment_status: "PAID",
      courseId: course_id,
      userId: userId,
    };

    if (enrollmentFound) {
      if (
        ["PENDING", "DROPPED"].includes(enrollmentFound?.status) ||
        enrollmentFound?.payment_status === "PENDING"
      ) {
        if (!course?.isFree) {
          course.price = course?.price || 0;
          const { id, receipt } = await createRazorpayOrder(
            course,
            userId,
            session,
            "course_purchase"
          );

          data.orderId = id;
          data.price = course.price;
          data.receipt = receipt;
          data.status = "PENDING";
          data.payment_status = "PENDING";
        }

        let enrollment: any = await tx.enrollment.update({
          data: data,
          where: {
            id: enrollmentFound?.id,
          },
        });

        return { ...enrollment, isFree: course?.isFree };
      } else {
        throw new ErrorHandler("Course is already purchased", 400);
      }
    }

    if (!course?.isFree) {
      course.price = course?.price || 0;
      try {
        const { id, receipt } = await createRazorpayOrder(
          course,
          userId,
          session,
          "course_purchase"
        );

        data.orderId = id;
        data.price = course.price;
        data.receipt = receipt;
        data.status = "PENDING";
        data.payment_status = "PENDING";
      } catch (error: any) {
        console.error("Razorpay order creation failed:", error);
        throw new ErrorHandler(
          error.error?.description || "Payment initialization failed",
          error.statusCode || 500
        );
      }
    }

    let enrollment: any = await tx.enrollment.create({
      data: data,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    return { ...enrollment, isFree: course?.isFree };
  });

  // let result = await prisma.$transaction(async (tx) => {
  //   data = await validateData(createCategorySchema, data);

  // });

  return NextResponse.json(
    {
      status: true,
      message: result?.isFree
        ? "Enrollment successful."
        : "Enrollment in process.",
      result,
    },
    { status: 201 }
  );
});
