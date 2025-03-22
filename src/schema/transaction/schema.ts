import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionStatus } from "@prisma/client";

export const createTransactionSchema = z
  .object({
    type: z.enum(["CREDIT", "DEBIT"]),
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((num) => !isNaN(num) && num >= 0, {
        message: "Amount must be a positive number",
      }),
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
    description: z.string(),
    paymentMethod: z.enum(["RAZORPAY", "UPI", "CREDIT_CARD", "DEBIT_CARD"]),
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
  })
  .strict()
  .partial();

export const changeTransactionStatusSchema = z
  .object({
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  })
  .strict()
  .partial();
