import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createTopicSchema = z
  .object({
    chapterId: z
      .string()
      .min(1, "chapter is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid chapter id provided",
      }),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().positive(),
    description: z.string().min(1, "Description is required"),
    video: z.string().min(1, "Description is required"),
    duration: z.number().positive(),
    status: z.enum(VALID_STATUS),
    isFree: z
      .union([z.string(), z.boolean()])
      .transform((val) => val == "true"),
  })
  .strict()
  .partial();

export const changeTopicStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();

export const changeTopicOrderSchema = z
  .object({
    chapterId: z
      .string()
      .min(1, "chapter is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid chapter id provided",
      }),
    topics: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1, "topic is required")
              .refine((val) => ObjectId.isValid(val), {
                message: "Invalid topic id provided",
              }),
            order: z.number().int().positive(),
          })
          .strict()
      )
      .min(2, "at least two topic is required"),
  })
  .strict();
