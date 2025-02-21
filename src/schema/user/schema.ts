import { VALID_ROLES } from "@/constants/config";
import { z } from "zod";

const createUserSchema = z
  .object({
    username: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .regex(/^[A-Za-z0-9_]$/, "name should not contain special characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Invalid phone number")
      .optional()
      .nullable(),
    role: z.enum(VALID_ROLES).optional(),
  })
  .strict();

export default createUserSchema;
