import { VALID_SATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createChapterSchema = z
  .object({
    courseId: z.string().refine((val) => ObjectId.isValid(val), {
      message: "Invalid instructor id provided",
    }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    description: z.string().min(1, "Description is required"),
    status: z.enum(VALID_SATUS),
    topics: z.array(z.string()).optional(),
  })
  .strict();

export const changeChapterStatusSchema = z
  .object({
    status: z.enum(VALID_SATUS),
  })
  .strict();

export const changeChapterOrderSchema = z
  .object({
    courseId: z.string().refine((val) => ObjectId.isValid(val), {
      message: "Invalid instructor id provided",
    }),
    chapters: z
      .array(
        z
          .object({
            id: z.string().refine((val) => ObjectId.isValid(val), {
              message: "Invalid instructor id provided",
            }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two chapter is required"),
  })
  .strict();
