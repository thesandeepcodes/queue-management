import { z } from "zod";

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

export const eventCreationSchema = z.object({
  name: z
    .string({ required_error: "Event name is required" })
    .min(3, "Event name must be at least 3 characters")
    .max(50, "Event name must be at most 50 characters"),
  description: z
    .string({ required_error: "Event description is required" })
    .max(1000, "Event description must be at most 1000 characters"),
  eventStartTime: z.coerce
    .date({
      required_error: "Event start time is required",
    })
    .optional(),
  eventEndTime: z.coerce
    .date({
      required_error: "Event end time is required",
    })
    .optional(),
  venue: z.string({ required_error: "Event venue is required" }).optional(),
  maxAttendees: z
    .number({ required_error: "Max attendees is required" })
    .min(0)
    .optional(),
  additionalInfo: z
    .array(
      z.object({
        name: z.string(),
        required: z.boolean(),
      })
    )
    .optional(),
  eventDate: z.coerce
    .date({ required_error: "Event date is required" })
    .min(today, "Event date must be in the future"),
});

export const eventUpdateSchema = z
  .object({
    name: z
      .string({ required_error: "Event name is required" })
      .min(3, "Event name must be at least 3 characters")
      .max(50, "Event name must be at most 50 characters"),
    description: z
      .string({ required_error: "Event description is required" })
      .max(1000, "Event description must be at most 1000 characters"),
    eventDate: z.coerce.date({ required_error: "Event date is required" }),
    eventStartTime: z.coerce.date({
      required_error: "Event start time is required",
    }),
    eventEndTime: z.coerce.date({
      required_error: "Event end time is required",
    }),
    venue: z.string({ required_error: "Event venue is required" }),
    completed: z.boolean(),
    maxAttendees: z
      .number({ required_error: "Max attendees is required" })
      .min(0),
    additionalInfo: z.array(
      z.object({
        name: z.string(),
        required: z.boolean(),
      })
    ),
    currentPosition: z
      .number({ required_error: "Current position is required" })
      .min(0, "Current position must be at least 0"),
  })
  .partial();
