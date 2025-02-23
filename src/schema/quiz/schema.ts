import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createQuizSchema = z
  .object({
    chapterId: z
      .string()
      .min(1, "chapter is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid chapter id provided",
      }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    passingScore: z.number().int().positive(),
    timeLimit: z.number().int().positive(),
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeQuizStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeQuizOrderSchema = z
  .object({
    chapterId: z
      .string()
      .min(1, "chapter is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid chapter id provided",
      }),
    quiz: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1, "quiz is required")
              .refine((val) => ObjectId.isValid(val), {
                message: "Invalid quiz id provided",
              }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two quiz is required"),
  })
  .strict();
