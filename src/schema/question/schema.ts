import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createQuestionSchema = z
  .object({
    quizId: z
      .string()
      .min(1, "quiz is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid quiz id provided",
      }),
    answerId: z
      .string()
      .min(1, "Answer is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid answer id provided",
      }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    points: z.number().int().positive(),
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeQuestionStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeQuestionOrderSchema = z
  .object({
    quizId: z
      .string()
      .min(1, "quiz is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid quiz id provided",
      }),
    questions: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1, "question is required")
              .refine((val) => ObjectId.isValid(val), {
                message: "Invalid question id provided",
              }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two questions is required"),
  })
  .strict();

export const checkAnswerSchema = z
  .object({
    questionId: z
      .string()
      .min(1, "question is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid question id provided",
      }),
    answerId: z
      .string()
      .min(1, "answer is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid answer id provided",
      }),
  })
  .strict();
