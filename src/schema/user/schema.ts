import { VALID_ROLES } from "@/constants/config";
import { z } from "zod";

const createUserSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    avatar: z.string().min(1, "Name must be at least 2 characters").nullable(),
    avatarKey: z
      .string()
      .min(1, "Name must be at least 2 characters")
      .nullable(),
    verifyCode: z
      .string()
      .min(1, "Name must be at least 2 characters")
      .nullable(),
    verifyCodeExpiry: z.date().nullable(),
    wallet_balance: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((num) => !isNaN(num) && num >= 0, {
        message: "Wallet balance must be a positive number",
      }),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Invalid phone number")
      .optional()
      .nullable(),
    isVerified: z
      .union([z.string(), z.boolean()])
      .transform((val) => val === true || val === "true"),
    isBlocked: z
      .union([z.string(), z.boolean()])
      .transform((val) => val === true || val === "true"),
    role: z.enum(VALID_ROLES),
  })
  .strict()
  .partial();

export default createUserSchema;
