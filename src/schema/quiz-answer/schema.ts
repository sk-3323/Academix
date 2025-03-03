import { ObjectId } from "mongodb";
import { z } from "zod";

const createQuizAnswerSchema = z
  .object({
    questionId: z
      .string()
      .min(1, "question is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid question id provided",
      }),
    quizProgressId: z
      .string()
      .min(1, "quiz progress is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid quiz progress id provided",
      }),

    answerId: z
      .string()
      .min(1, "answer is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid answer id provided",
      }),
  })
  .strict()
  .partial();

export default createQuizAnswerSchema;
