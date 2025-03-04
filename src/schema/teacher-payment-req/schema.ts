import { ObjectId } from "mongodb";
import { z } from "zod";

export const createPayementReqSchema = z
  .object({
    courseId: z
      .string()
      .min(1, "courseId is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid course id provided",
      }),
    amount: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  })
  .strict()
  .partial();
