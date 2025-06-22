import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});
