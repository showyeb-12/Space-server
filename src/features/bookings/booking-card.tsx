"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/features/bookings/booking-schema";
import { api, ApiError } from "@/lib/api";
import {
  formatCurrency,
  formatTime,
  timeToMinutes,
  todayISO,
} from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { Booking, Studio } from "@/types";

const timeOptions = Array.from({ length: 29 }, (_, index) => {
  const minutes = 8 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
});

export function BookingCard({ studio }: { studio: Studio }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: "",
      startTime: "10:00",
      endTime: "12:00",
      note: "",
    },
  });

  const startTime = useWatch({ control, name: "startTime" }) ?? "10:00";
  const endTime = useWatch({ control, name: "endTime" }) ?? "12:00";
  const durationMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  const hours = durationMinutes > 0 ? durationMinutes / 60 : 0;
  const estimate = Math.round(hours * studio.hourlyRate * 100) / 100;

  function openBooking() {
    if (!user) {
      toast.error("Sign in to request this studio.", {
        description: "Your session is needed to hold a booking request.",
      });
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setFormError(null);
    setIsOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await api.post<{ booking: Booking }>("/bookings", {
        studioId: studio.id,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        note: values.note?.trim() || undefined,
      });

      toast.success("Booking requested.", {
        description: "The host will review your request shortly.",
      });
      setIsOpen(false);
      reset({ date: "", startTime: "10:00", endTime: "12:00", note: "" });
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "BOOKING_CONFLICT") {
          setFormError(error.message);
          toast.error("That slot is already taken.", {
            description: "Choose another date or time window.",
          });
          return;
        }

        setFormError(error.message);
        toast.error("Booking could not be requested.", {
          description: error.message,
        });
        return;
      }

      toast.error("Something went wrong. Please try again.");
    }
  });

  function closeModal() {
    if (isSubmitting) return;
    setIsOpen(false);
    setFormError(null);
  }

  return (
    <>
      <div className="hidden rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6 shadow-xl shadow-base-content/5 lg:block">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-base-content/40">
              From
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
              {formatCurrency(studio.hourlyRate)}
              <span className="ml-1 font-sans text-xs font-medium text-base-content/45">
                /hour
              </span>
            </p>
          </div>
          {studio.reviewCount > 0 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5 text-xs font-semibold">
              <Star
                className="size-3.5 fill-current text-warning"
                aria-hidden="true"
              />
              {studio.rating.toFixed(1)}
              <span className="font-normal text-base-content/45">
                ({studio.reviewCount})
              </span>
            </span>
          ) : (
            <span className="rounded-full bg-base-200 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-base-content/50">
              New
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-2 border-t border-base-content/10 pt-5 text-sm">
          <p className="flex items-center gap-2.5 text-base-content/60">
            <ShieldCheck className="size-4 text-base-content/35" aria-hidden="true" />
            {studio.securityDeposit > 0
              ? `${formatCurrency(studio.securityDeposit)} refundable deposit`
              : "No security deposit"}
          </p>
          <p className="flex items-center gap-2.5 text-base-content/60">
            <Users className="size-4 text-base-content/35" aria-hidden="true" />
            Up to {studio.capacity} people
          </p>
          <p className="flex items-center gap-2.5 text-base-content/60">
            <Clock className="size-4 text-base-content/35" aria-hidden="true" />
            30-minute minimum booking
          </p>
          <p className="flex items-center gap-2.5 text-base-content/60">
            <MapPin className="size-4 text-base-content/35" aria-hidden="true" />
            {studio.location}
          </p>
        </div>

        <Button size="lg" className="mt-6 w-full" onClick={openBooking}>
          Request booking
          <CalendarDays className="size-4" aria-hidden="true" />
        </Button>
        <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-base-content/40">
          You will not be charged yet. The host confirms every request first.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-base-content/10 bg-base-100/95 backdrop-blur-xl lg:hidden">
        <div className="container-shell flex items-center justify-between gap-4 py-3">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">
              {formatCurrency(studio.hourlyRate)}
              <span className="ml-1 font-sans text-[0.65rem] font-medium text-base-content/45">
                /hour
              </span>
            </p>
            <p className="text-[0.68rem] text-base-content/45">
              {studio.securityDeposit > 0
                ? `${formatCurrency(studio.securityDeposit)} deposit`
                : "No deposit"}
            </p>
          </div>
          <Button onClick={openBooking}>Request booking</Button>
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={closeModal}
        title="Request this studio"
        description={`Tell ${studio.owner.name} when you need the space. They will confirm the request before anything is locked in.`}
        preventClose={isSubmitting}
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="booking-form"
              size="sm"
              isLoading={isSubmitting}
            >
              Send request
            </Button>
          </>
        }
      >
        <form id="booking-form" onSubmit={onSubmit} className="space-y-4">
          {formError ? (
            <div
              role="alert"
              className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
            >
              {formError}
            </div>
          ) : null}

          <div>
            <label
              htmlFor="booking-date"
              className="mb-1.5 block text-xs font-semibold text-base-content/70"
            >
              Date
            </label>
            <input
              id="booking-date"
              type="date"
              min={todayISO()}
              className="input input-bordered h-11 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
              {...register("date")}
            />
            {errors.date?.message ? (
              <p className="mt-1.5 text-xs font-medium text-error">
                {errors.date.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="booking-start"
                className="mb-1.5 block text-xs font-semibold text-base-content/70"
              >
                Start time
              </label>
              <select
                id="booking-start"
                className="select select-bordered h-11 min-h-0 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
                {...register("startTime")}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </select>
              {errors.startTime?.message ? (
                <p className="mt-1.5 text-xs font-medium text-error">
                  {errors.startTime.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="booking-end"
                className="mb-1.5 block text-xs font-semibold text-base-content/70"
              >
                End time
              </label>
              <select
                id="booking-end"
                className="select select-bordered h-11 min-h-0 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
                {...register("endTime")}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </select>
              {errors.endTime?.message ? (
                <p className="mt-1.5 text-xs font-medium text-error">
                  {errors.endTime.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="booking-note"
              className="mb-1.5 block text-xs font-semibold text-base-content/70"
            >
              Note for the host{" "}
              <span className="font-normal text-base-content/40">
                (optional)
              </span>
            </label>
            <textarea
              id="booking-note"
              rows={3}
              placeholder="Crew size, setup needs, anything the host should know…"
              className="textarea textarea-bordered w-full resize-none rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
              {...register("note")}
            />
            {errors.note?.message ? (
              <p className="mt-1.5 text-xs font-medium text-error">
                {errors.note.message}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-base-content/10 bg-base-200/60 p-4">
            {hours > 0 ? (
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-base-content/55">
                  <span>
                    {formatTime(startTime)} – {formatTime(endTime)} ·{" "}
                    {hours % 1 === 0 ? hours : hours.toFixed(2)} hr
                  </span>
                  <span>{formatCurrency(estimate)}</span>
                </div>
                <div className="flex items-center justify-between text-base-content/55">
                  <span>Security deposit</span>
                  <span>{formatCurrency(studio.securityDeposit)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-base-content/10 pt-2 font-semibold">
                  <span>Estimated total</span>
                  <span>{formatCurrency(estimate + studio.securityDeposit)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-base-content/50">
                Choose a start and end time to see the estimate.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
