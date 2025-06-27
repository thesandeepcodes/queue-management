import { z } from "zod";

export const pushNotificationSchema = z.object({
  type: z
    .string({ required_error: "Type is required" })
    .refine((type) => ["alert", "warning", "info"].includes(type), {
      message: "Invalid type. Must be 'alert', 'warning', or 'info'",
    }),
  sendTo: z
    .string({ required_error: "Send to is required" })
    .refine((sendTo) => ["all", "served", "awaiting"].includes(sendTo), {
      message: "Invalid send to. Must be 'all', 'guests', or 'non-guests'",
    }),
  message: z
    .string({ required_error: "Message is required" })
    .min(2, "Message must be at least 2 characters")
    .max(1000, "Message must be at most 1000 characters"),
  startTime: z.coerce.date({ required_error: "Start time is required" }),
  endTime: z.coerce.date({ required_error: "End time is required" }),
});
