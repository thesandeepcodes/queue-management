import mongoose from "mongoose";
import { z } from "zod";

export const queueCreationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
});

export const moveQueueSchema = z.object({
  newPosition: z.number().min(0),
  guestId: z.string().refine(mongoose.isValidObjectId, {
    message: "Invalid guest ID",
  }),
});
