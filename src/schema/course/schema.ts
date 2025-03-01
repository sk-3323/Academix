import { z } from "zod";
import { ObjectId } from "mongodb";
import { VALID_STATUS } from "@/constants/config";

export const createCourseSchema = z
  .object({
    instructorId: z
      .string()
      .min(1, "course is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid instructor id provided",
      }),
    title: z.string().min(1, "Title is required"),
    isFree: z
      .union([z.string(), z.boolean()])
      .transform((val) => val == "true"),
    description: z.string().min(1, "Description is required"),
    thumbnail: z.string(),
    thumbnailKey: z.string(),
    categoryId: z
      .string()
      .min(1, "category is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid category id provided",
      }),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((num) => !isNaN(num) && num >= 0, {
        message: "Price must be a positive number",
      }),
    isFreeTier: z
      .union([z.string(), z.boolean()])
      .transform((val) => Boolean(val)),
    status: z.enum(VALID_STATUS),
    // categoryId: z.union([
    //   z.string().transform((val) => {
    //     try {
    //       const parsed = JSON.parse(val);
    //       return Array.isArray(parsed) ? parsed : [];
    //     } catch {
    //       return [];
    //     }
    //   }),
    //   z
    //     .array(
    //       z
    //         .string()
    //         .min(1, "category is required")
    //         .refine((val) => ObjectId.isValid(val), {
    //           message: "Invalid category id",
    //         })
    //     )
    //     .nonempty("At least one category id is required"),
    // ]),
  })
  .strict()
  .partial();

export const createCourseWithProgressSchema = z
  .object({
    userId: z
      .string()
      .min(1, "user is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid user id provided",
      }),
    categoryId: z
      .string()
      .min(1, "category is required")
      .refine((val) => ObjectId.isValid(val), {
        message: "Invalid category id provided",
      }),
    title: z.string().min(1, "Title is required"),
  })
  .strict()
  .partial();

export const changeCourseStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict()
  .partial();
