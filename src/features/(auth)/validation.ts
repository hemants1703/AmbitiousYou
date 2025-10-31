import { z } from "zod";

export const SignupSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(50, { message: "Full name must be less than 50 characters" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(
      (password) =>
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password),
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
      }
    ),
});

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
