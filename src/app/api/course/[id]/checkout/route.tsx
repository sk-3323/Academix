import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { validateData } from "@/lib/fileHandler";
import createCategorySchema from "@/schema/category/schema";
import { razorpay } from "@/lib/razorpay";
import { decryptToken } from "@/lib/jwtGenerator";

// export const GET = apiHandler(async (request: NextRequest, content: any) => {
//   let result = await prisma.$transaction(async (tx) => {
//     return await tx.category.findMany({
//       orderBy: {
//         id: "desc",
//       },
//       include: {
//         course: true,
//       },
//     });
//   });

//   if (result?.length === 0) {
//     throw new ErrorHandler("No data found", 404);
//   }

//   return NextResponse.json(
//     {
//       status: true,
//       message: "categories fetched successfully",
//       result,
//     },
//     { status: 200 }
//   );
// });

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

    let enrollment = await tx.enrollment.findUnique({
      where: {
        userId_courseId: {
          courseId: course_id,
          userId: userId,
        },
      },
    });

    if (enrollment) {
      throw new ErrorHandler("Course is already purchased", 400);
    }

    let data: any = {
      status: "ACTIVE",
      payment_status: "PAID",
      courseId: course_id,
      userId: userId,
    };

    if (!course?.isFree) {
      course.price = course?.price || 0;
      let receipt = `receipt_${Math.random().toString(36).substring(7)}_${Date.now()}`;
      const order = await razorpay.orders.create({
        amount: course?.price * 100,
        currency: "INR",
        customer_id: userId,
        notes: {
          course_id: course?.id,
          course_name: course?.title,
          course_price: course?.price,
          instructor_id: course?.instructor?.id,
          instructor_name: course?.instructor?.username,

          customer_id: userId,
          customer_name: session?.username,
          customer_email: session?.email,
          customer_contact: session?.phone,

          type: "course_purchase",
          receipt: receipt,
        },
        receipt: receipt,
      });

      data.orderId = order?.id;
      data.price = course.price;
      data.receipt = order?.receipt;
      data.status = "PENDING";
      data.payment_status = "PENDING";
    }

    return await tx.enrollment.create({
      data: data,
    });
  });

  // let result = await prisma.$transaction(async (tx) => {
  //   data = await validateData(createCategorySchema, data);

  // });

  return NextResponse.json(
    {
      status: true,
      message: "enrollment created successfully",
      result,
    },
    { status: 201 }
  );
});
