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
    description: z.string().min(1, "Description is required"),
    thumbnail: z.string().optional(),
    categoryId: z.union([
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
      z
        .array(
          z
            .string()
            .min(1, "course is required")
            .refine((val) => ObjectId.isValid(val), {
              message: "Invalid category id",
            })
        )
        .nonempty("At least one category id is required"),
    ]),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((num) => !isNaN(num) && num >= 0, {
        message: "Price must be a positive number",
      })
      .optional(),
    isFreeTier: z
      .union([z.string(), z.boolean()])
      .transform((val) => Boolean(val)),
    status: z.enum(VALID_STATUS).optional(),
  })
  .strict();

export const changeCourseStatusSchema = z
  .object({
    status: z.enum(VALID_STATUS),
  })
  .strict();
