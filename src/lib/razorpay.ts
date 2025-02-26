import Razorpay from "razorpay";
import { ErrorHandler } from "./errorHandler";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (
  course: any,
  userId: any,
  user: any,
  type: any = "course_purchase"
) => {
  const receipt = `receipt_${Math.random().toString(36).substring(7)}_${Date.now()}`;
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(course?.price * 100),
      currency: "INR",
      notes: {
        course_id: course?.id,
        course_name: course?.title,
        course_price: course?.price,
        instructor_id: course?.instructor?.id,
        instructor_name: course?.instructor?.username,

        customer_id: userId,
        customer_name: user?.username,
        customer_email: user?.email,
        customer_contact: user?.phone,

        type: type,
        receipt: receipt,
      },
      receipt: receipt,
    });
    return order;
  } catch (error: any) {
    throw new ErrorHandler(
      error.error?.description || "Payment initialization failed",
      error.statusCode || 500
    );
  }
};
