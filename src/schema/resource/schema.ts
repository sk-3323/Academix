import { VALID_STATUS } from "@/constants/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const createResourceSchema = z
  .object({
    chapterId: z
      .string()
      .min(1, "chapter is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid chapter id provided",
      }),
    title: z.string().min(1, "Title is required"),
    url: z.string().min(1, "Description is required"),
  })
  .strict()
  .partial();
