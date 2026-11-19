import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.");

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email: emailSchema,
  photoURL: z.string().trim().optional(),
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
