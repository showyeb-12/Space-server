import { z } from "zod";
import { timeToMinutes } from "@/lib/utils";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const bookingFormSchema = z
  .object({
    date: z
      .string()
      .min(1, "Choose a date.")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
    startTime: z
      .string()
      .regex(timePattern, "Choose a valid start time."),
    endTime: z.string().regex(timePattern, "Choose a valid end time."),
    note: z
      .string()
      .max(500, "Notes must be 500 characters or fewer.")
      .optional(),
  })
  .superRefine((value, ctx) => {
    const start = timeToMinutes(value.startTime);
    const end = timeToMinutes(value.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be later than the start time.",
      });
      return;
    }

    if (end - start < 30) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Bookings must be at least 30 minutes long.",
      });
    }

    if (end - start > 12 * 60) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Bookings cannot exceed 12 hours.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${value.date}T00:00:00`);

    if (chosen.getTime() < today.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Choose today or a future date.",
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
