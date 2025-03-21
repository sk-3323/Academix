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
    url: z.string().min(1, "URL is required"),
    publicKey: z.string().min(1, "public key is required"),
  })
  .strict()
  .partial();
