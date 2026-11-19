import { z } from "zod";
import { STUDIO_CATEGORIES } from "@/lib/constants";

const httpUrl = z
  .string()
  .trim()
  .url("Enter a valid image URL.")
  .max(1000, "Image URLs must be 1000 characters or fewer.")
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "Image URL must start with http:// or https://.",
  });

export const studioFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  category: z.enum(STUDIO_CATEGORIES, {
    message: "Choose a valid studio category.",
  }),
  hourlyRate: z
    .number({ message: "Enter an hourly rate." })
    .positive("Hourly rate must be greater than 0.")
    .max(100_000, "Hourly rate is too high."),
  securityDeposit: z
    .number({ message: "Enter a security deposit." })
    .nonnegative("Security deposit cannot be negative.")
    .max(1_000_000, "Security deposit is too high."),
  capacity: z
    .number({ message: "Enter a capacity." })
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1.")
    .max(5_000, "Capacity is too high."),
  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters.")
    .max(200, "Location must be 200 characters or fewer."),
  imageUrl: httpUrl,
  amenitiesText: z
    .string()
    .max(1_200, "Keep amenities under 1,200 characters.")
    .optional(),
  overview: z
    .string()
    .trim()
    .min(20, "Overview must be at least 20 characters.")
    .max(4_000, "Overview must be 4,000 characters or fewer."),
});

export type StudioFormValues = z.infer<typeof studioFormSchema>;

export function parseAmenities(value: string | undefined): string[] {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}
