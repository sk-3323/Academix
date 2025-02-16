import { ObjectId } from "mongodb";
import { z } from "zod";

const createEnrollmentSchema = z
  .object({
    courseId: z
      .string()
      .min(1, "course is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid course id provided",
      }),

    userId: z
      .string()
      .min(1, "user is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid user id provided",
      }),
  })
  .strict()
  .partial();

export default createEnrollmentSchema;
