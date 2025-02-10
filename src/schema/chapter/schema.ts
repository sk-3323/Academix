import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createChapterSchema = z
  .object({
    courseId: z
      .string()
      .min(1, "course is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid course id provided",
      }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    description: z.string().min(1, "Description is required"),
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeChapterStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeChapterOrderSchema = z
  .object({
    courseId: z
      .string()
      .min(1, "course is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid course id provided",
      }),
    chapters: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1, "course is required")
              .refine((val) => ObjectId.isValid(val), {
                message: "Invalid chapter id provided",
              }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two chapter is required"),
  })
  .strict();
