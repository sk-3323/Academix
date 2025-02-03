import { z } from "zod";
import { ObjectId } from "mongodb";

const createCourseSchema = z.object({
  instructorId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid instructor id provided",
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string(),
  categoryId: z
    .array(
      z.string().refine((val) => ObjectId.isValid(val), {
        message: "Invalid category id",
      })
    )
    .nonempty("At least one category id is required"),
  price: z.number().min(0, "Price must be a positive number"),
  isFreeTier: z.boolean(),
});

export default createCourseSchema;
