"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check, CircleDollarSign, ImageIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { ImageUploader } from "@/features/studios/image-uploader";
import {
  parseAmenities,
  studioFormSchema,
  type StudioFormValues,
} from "@/features/studios/studio-form-schema";
import { api, ApiError } from "@/lib/api";
import { STUDIO_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { Studio } from "@/types";

const inputClass =
  "input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold text-base-content/70";
const errorClass = "mt-1.5 text-xs font-medium text-error";

const formFields: Array<keyof StudioFormValues> = [
  "title",
  "category",
  "hourlyRate",
  "securityDeposit",
  "capacity",
  "location",
  "imageUrl",
  "amenitiesText",
  "overview",
];

const hostTips = [
  "Lead with the light, sound, and space people are booking.",
  "Be specific about access, load-in, and house rules.",
  "Keep your deposit realistic for the room you offer.",
];

export function StudioForm({ studio }: { studio?: Studio }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(studio);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StudioFormValues>({
    resolver: zodResolver(studioFormSchema),
    defaultValues: {
      title: studio?.title ?? "",
      category: studio?.category ?? "Photo Studio",
      hourlyRate: studio?.hourlyRate ?? 75,
      securityDeposit: studio?.securityDeposit ?? 0,
      capacity: studio?.capacity ?? 4,
      location: studio?.location ?? "",
      imageUrl: studio?.imageUrl ?? "",
      amenitiesText: studio?.amenities.join(", ") ?? "",
      overview: studio?.overview ?? "",
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const gallery = studio
      ? Array.from(
          new Set(
            studio.gallery.map((image) =>
              image === studio.imageUrl ? values.imageUrl : image,
            ),
          ),
        )
      : [];

    const payload = {
      title: values.title,
      category: values.category,
      hourlyRate: values.hourlyRate,
      securityDeposit: values.securityDeposit,
      capacity: values.capacity,
      location: values.location,
      imageUrl: values.imageUrl,
      amenities: parseAmenities(values.amenitiesText),
      overview: values.overview,
      gallery,
    };

    try {
      if (studio) {
        await api.patch<{ studio: Studio }>(`/studios/${studio.id}`, payload);
        toast.success("Listing updated successfully.");
      } else {
        await api.post<{ studio: Studio }>("/studios", payload);
        toast.success("Your studio is live.", {
          description: "It is now visible in Explore Studios.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["studios"] });
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "We could not save this listing. Please try again.";
      setFormError(message);
      toast.error("Could not save your listing.", { description: message });

      if (error instanceof ApiError && error.errors && typeof error.errors === "object") {
        const fieldErrors = error.errors as Record<string, string[] | undefined>;

        for (const [rawField, messages] of Object.entries(fieldErrors)) {
          const field = rawField === "amenities" ? "amenitiesText" : rawField;

          if (
            messages?.[0] &&
            formFields.includes(field as keyof StudioFormValues)
          ) {
            setError(field as Path<StudioFormValues>, {
              type: "server",
              message: messages[0],
            });
          }
        }
      }
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.7fr)] lg:items-start"
      noValidate
    >
      <div className="space-y-6">
        {formError ? (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
          >
            {formError}
          </div>
        ) : null}

        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary/25 text-base-content">
              <ImageIcon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                The basics
              </h2>
              <p className="text-xs text-base-content/45">
                What the space is, where it is, and what it costs.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="studio-title" className={labelClass}>
                Listing title
              </label>
              <input
                id="studio-title"
                type="text"
                placeholder="The Daylight Cyc Loft"
                className={inputClass}
                {...register("title")}
              />
              {errors.title?.message ? (
                <p className={errorClass}>{errors.title.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="studio-category" className={labelClass}>
                Category
              </label>
              <select
                id="studio-category"
                className={cn(inputClass, "select")}
                {...register("category")}
              >
                {STUDIO_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category?.message ? (
                <p className={errorClass}>{errors.category.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="studio-location" className={labelClass}>
                Location
              </label>
              <input
                id="studio-location"
                type="text"
                placeholder="Arts District, Los Angeles"
                className={inputClass}
                {...register("location")}
              />
              {errors.location?.message ? (
                <p className={errorClass}>{errors.location.message}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="studio-rate" className={labelClass}>
                  Hourly rate (USD)
                </label>
                <input
                  id="studio-rate"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  className={inputClass}
                  {...register("hourlyRate", { valueAsNumber: true })}
                />
                {errors.hourlyRate?.message ? (
                  <p className={errorClass}>{errors.hourlyRate.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="studio-deposit" className={labelClass}>
                  Security deposit
                </label>
                <input
                  id="studio-deposit"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className={inputClass}
                  {...register("securityDeposit", { valueAsNumber: true })}
                />
                {errors.securityDeposit?.message ? (
                  <p className={errorClass}>{errors.securityDeposit.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="studio-capacity" className={labelClass}>
                  Capacity
                </label>
                <input
                  id="studio-capacity"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  className={inputClass}
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity?.message ? (
                  <p className={errorClass}>{errors.capacity.message}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary/25 text-base-content">
              <CircleDollarSign className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                The story
              </h2>
              <p className="text-xs text-base-content/45">
                Help guests picture the room before they arrive.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="studio-overview" className={labelClass}>
                Overview
              </label>
              <textarea
                id="studio-overview"
                rows={6}
                placeholder="Describe the light, the gear, the vibe, and who the space is best for."
                className="textarea textarea-bordered min-h-36 w-full rounded-xl border-base-content/10 bg-base-100 text-sm leading-relaxed focus:border-base-content/30 focus:outline-none"
                {...register("overview")}
              />
              {errors.overview?.message ? (
                <p className={errorClass}>{errors.overview.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="studio-amenities" className={labelClass}>
                Amenities
              </label>
              <input
                id="studio-amenities"
                type="text"
                placeholder="Natural light, Wi-Fi, blackout curtains, loading dock"
                className={inputClass}
                {...register("amenitiesText")}
              />
              <p className="mt-1.5 text-[0.68rem] text-base-content/40">
                Separate each amenity with a comma.
              </p>
              {errors.amenitiesText?.message ? (
                <p className={errorClass}>{errors.amenitiesText.message}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary/25 text-base-content">
              <ImageIcon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Cover image
              </h2>
              <p className="text-xs text-base-content/45">
                Upload a file to ImgBB or paste a hosted image URL.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <ImageUploader
              value={imageUrl}
              onChange={(value) =>
                setValue("imageUrl", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={errors.imageUrl?.message}
            />
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/my-listings"
            className={buttonStyles({ variant: "ghost", size: "md" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            {isEdit ? "Save changes" : "Publish studio"}
          </Button>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-base-content/40">
            Host details
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar
              name={user?.name ?? "Host"}
              photoURL={user?.photoURL}
              className="size-11 text-xs"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-base-content/45">
                {user?.email}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-base-content/50">
            Listings are tied to your signed-in account. Guests see your name,
            photo, and booking requests land directly with you.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-200/40 p-5">
          <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-base-content/40">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            A listing that books
          </p>
          <ul className="mt-4 space-y-3">
            {hostTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary/30 text-base-content">
                  <Check className="size-2.5" aria-hidden="true" />
                </span>
                <span className="text-xs leading-relaxed text-base-content/60">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="px-1 text-[0.68rem] leading-relaxed text-base-content/40">
          Need a hand?{" "}
          <a
            href="mailto:hello@studiospace.com"
            className="font-semibold text-base-content/60 underline-offset-4 hover:underline"
          >
            hello@studiospace.com
          </a>
        </p>
      </aside>
    </form>
  );
}
