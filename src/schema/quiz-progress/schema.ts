import { ObjectId } from "mongodb";
import { z } from "zod";

const createQuizProgressSchema = z
  .object({
    quizId: z
      .string()
      .min(1, "quiz is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid quiz id provided",
      }),

    userId: z
      .string()
      .min(1, "user is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid user id provided",
      }),
    isCompleted: z.boolean(),
    correct: z.number().int(),
    wrong: z.number().int(),
  })
  .strict()
  .partial();

export default createQuizProgressSchema;
