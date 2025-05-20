import { z } from "zod";

export const eventCreationSchema = z.object({
  name: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(50, "Event name must be at most 50 characters"),
  description: z
    .string()
    .max(1000, "Event description must be at most 1000 characters"),
});

export const eventUpdateSchema = z
  .object({
    name: z
      .string()
      .min(3, "Event name must be at least 3 characters")
      .max(50, "Event name must be at most 50 characters"),
    description: z
      .string()
      .max(1000, "Event description must be at most 1000 characters"),
    currentPosition: z.number().min(0),
  })
  .partial();
