import { z } from "zod";

const createCategorySchema = z
  .object({
    name: z.string().min(1, "Category name is required"), // Ensure name is not empty
  })
  .strict();

export default createCategorySchema;
