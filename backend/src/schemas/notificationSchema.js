import { z } from "zod";

export const pushNotificationSchema = z.object({ message: z.string().min(1) });
