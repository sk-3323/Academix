import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createOptionSchema = z
  .object({
    questionId: z
      .string()
      .min(1, "question is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid question id provided",
      }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeOptionStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeOptionOrderSchema = z
  .object({
    questionId: z
      .string()
      .min(1, "question is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid question id provided",
      }),
    options: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1, "option is required")
              .refine((val) => ObjectId.isValid(val), {
                message: "Invalid option id provided",
              }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two options is required"),
  })
  .strict();
