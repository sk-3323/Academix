import { ObjectId } from "mongodb";
import { z } from "zod";

const createUserProgressSchema = z
  .object({
    topicId: z
      .string()
      .min(1, "topic is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid topic id provided",
      }),

    userId: z
      .string()
      .min(1, "user is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid user id provided",
      }),
    isCompleted: z.boolean(),
  })
  .strict()
  .partial();

export default createUserProgressSchema;
