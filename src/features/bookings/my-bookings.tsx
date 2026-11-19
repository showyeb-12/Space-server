"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CalendarX2,
  Clock,
  Download,
  ShieldCheck,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { api, ApiError } from "@/lib/api";
import { generateInvoicePdf } from "@/lib/generate-invoice";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/constants";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

type BookingFilter = BookingStatus | "All";

const filters: BookingFilter[] = ["All", ...BOOKING_STATUSES];

function BookingsSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100"
        >
          <div className="grid sm:grid-cols-[13rem_1fr]">
            <Skeleton className="aspect-[4/3] rounded-none sm:aspect-auto sm:h-full" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyBookings() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<BookingFilter>("All");
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const bookingsQuery = useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async (): Promise<Booking[]> => {
      const response = await api.get<{ bookings: Booking[] }>("/bookings/mine");
      return response.data.bookings;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.patch<{ booking: Booking }>(
        `/bookings/${bookingId}/cancel`,
      );
      return response.data.booking;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setBookingToCancel(null);
      toast.success("Booking cancelled.");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not cancel this booking. Please try again.",
      );
    },
  });

  const bookings = useMemo(
    () => bookingsQuery.data ?? [],
    [bookingsQuery.data],
  );

  const counts = useMemo(() => {
    const result: Record<BookingFilter, number> = {
      All: bookings.length,
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };

    for (const booking of bookings) {
      result[booking.status] += 1;
    }

    return result;
  }, [bookings]);

  const filtered =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  if (bookingsQuery.isPending) {
    return <BookingsSkeleton />;
  }

  if (bookingsQuery.error) {
    return (
      <div className="mt-8">
        <ErrorState
          title="Your bookings did not load."
          description="We could not reach your booking history. Check your connection and try again."
          onRetry={() => void bookingsQuery.refetch()}
        />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={CalendarX2}
          title="No bookings yet."
          description="Find a space that fits the work, request a slot, and your reservations will show up here."
          action={
            <Link
              href="/studios"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Explore studios
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
              filter === option
                ? "border-base-content bg-base-content text-base-100"
                : "border-base-content/10 bg-base-100 text-base-content/55 hover:border-base-content/30 hover:text-base-content",
            )}
          >
            {option}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold",
                filter === option
                  ? "bg-base-100/20 text-base-100"
                  : "bg-base-200 text-base-content/50",
              )}
            >
              {counts[option]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={CalendarX2}
            title={`No ${filter.toLowerCase()} bookings.`}
            description={`You do not have any ${filter.toLowerCase()} bookings right now. Try another status or browse more spaces.`}
            action={
              <Button variant="outline" size="sm" onClick={() => setFilter("All")}>
                Show all bookings
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((booking) => (
            <article
              key={booking.id}
              className="overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100"
            >
              <div className="grid sm:grid-cols-[13rem_1fr]">
                <Link
                  href={`/studios/${booking.studioId}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-base-300 sm:aspect-auto sm:h-full sm:min-h-44"
                >
                  <Image
                    src={booking.studioImage}
                    alt={booking.studioTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  />
                </Link>

                <div className="flex min-w-0 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-base-content/35">
                        Booking · {booking.id.slice(-6).toUpperCase()}
                      </p>
                      <Link href={`/studios/${booking.studioId}`}>
                        <h2 className="mt-1 line-clamp-1 font-display text-xl font-semibold tracking-tight">
                          {booking.studioTitle}
                        </h2>
                      </Link>
                    </div>
                    <StatusBadge status={booking.status} className="shrink-0" />
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5 rounded-xl bg-base-200/70 px-3 py-2.5">
                      <CalendarDays
                        className="size-4 shrink-0 text-base-content/40"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-base-content/40">
                          Date
                        </p>
                        <p className="text-xs font-semibold">
                          {formatDate(booking.date, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl bg-base-200/70 px-3 py-2.5">
                      <Clock
                        className="size-4 shrink-0 text-base-content/40"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-base-content/40">
                          Time
                        </p>
                        <p className="text-xs font-semibold">
                          {formatTime(booking.startTime)} –{" "}
                          {formatTime(booking.endTime)} ·{" "}
                          {booking.hours % 1 === 0
                            ? booking.hours
                            : booking.hours.toFixed(2)}{" "}
                          hr
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.note ? (
                    <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-base-content/55">
                      <StickyNote
                        className="mt-0.5 size-3.5 shrink-0 text-base-content/35"
                        aria-hidden="true"
                      />
                      <p className="line-clamp-2">{booking.note}</p>
                    </div>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10 pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/55">
                      <span>
                        <span className="font-semibold text-base-content">
                          {formatCurrency(booking.totalPrice)}
                        </span>{" "}
                        studio time
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck
                          className="size-3.5 text-base-content/35"
                          aria-hidden="true"
                        />
                        {booking.securityDeposit > 0
                          ? `${formatCurrency(booking.securityDeposit)} deposit`
                          : "No deposit"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className={buttonStyles({
                          variant: "ghost",
                          size: "sm",
                        })}
                      >
                        View studio
                      </Link>

                      {booking.status === "Pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingToCancel(booking)}
                          className="text-error hover:bg-error/10 hover:border-error/30"
                        >
                          Cancel Booking
                        </Button>
                      ) : null}

                      {booking.status === "Confirmed" ||
                      booking.status === "Completed" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            generateInvoicePdf(booking);
                            toast.success("Invoice downloaded as PDF.");
                          }}
                          className="gap-1.5"
                          title="Download PDF invoice receipt"
                        >
                          <Download className="size-3.5" aria-hidden="true" />
                          <span>PDF Invoice</span>
                        </Button>
                      ) : null}

                      {booking.status === "Cancelled" ? (
                        <span className="rounded-full bg-base-200 px-3 py-1.5 text-[0.65rem] font-semibold text-base-content/45">
                          Cancelled
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(bookingToCancel)}
        onClose={() => setBookingToCancel(null)}
        onConfirm={() => {
          if (bookingToCancel) cancelMutation.mutate(bookingToCancel.id);
        }}
        title="Cancel this booking?"
        description={
          bookingToCancel
            ? `Your booking for ${bookingToCancel.studioTitle} on ${formatDate(
                bookingToCancel.date,
                { month: "long", day: "numeric" },
              )} will be cancelled. You can always book another slot.`
            : ""
        }
        confirmLabel="Cancel Booking"
        cancelLabel="Keep booking"
        isLoading={cancelMutation.isPending}
      />
    </>
  );
}
