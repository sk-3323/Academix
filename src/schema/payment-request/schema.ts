import { z } from "zod";
import { ObjectId } from "mongodb";

export const createPaymentRequestSchema = z
  .object({
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((num) => !isNaN(num) && num >= 0, {
        message: "Amount must be a positive number",
      }),
    userId: z
      .string()
      .min(1, "user is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid user id provided",
      }),
    courseId: z
      .string()
      .min(1, "course is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid course id provided",
      }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    paymentMethod: z.enum(["RAZORPAY", "UPI", "CREDIT_CARD", "DEBIT_CARD"]),
  })
  .strict()
  .partial();

export const changePaymentRequestStatusSchema = z
  .object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  })
  .strict()
  .partial();
