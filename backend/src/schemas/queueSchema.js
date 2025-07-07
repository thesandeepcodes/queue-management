import mongoose from "mongoose";
import { z } from "zod";

export const queueCreationSchema = z.object({
  guestId: z
    .string()
    .refine(mongoose.isValidObjectId, { message: "Invalid guest ID" })
    .optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string({ required_error: "Phone number is required" }),
  additionalInfo: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const moveQueueSchema = z.object({
  positions: z
    .record(
      z.coerce.number().int().nonnegative(),
      z.number().int().nonnegative()
    )
    .refine(
      (obj) => {
        const values = Object.values(obj);
        const valueSet = new Set(values);
        return values.length === valueSet.size;
      },
      {
        message: "Target indices must be unique",
      }
    )
    .refine(
      (obj) => {
        return Object.entries(obj).every(([from, to]) => Number(from) !== to);
      },
      {
        message: "Mappings must represent actual changes (from ≠ to)",
      }
    ),
});
