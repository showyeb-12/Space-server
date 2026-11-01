"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  CalendarX2,
  Heart,
  Plus,
  Search,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { Booking, Studio } from "@/types";

const quickActions = [
  {
    href: "/add-studio",
    label: "Add a new studio",
    description: "Publish another space to your calendar.",
    icon: Plus,
  },
  {
    href: "/studios",
    label: "Explore studios",
    description: "Browse rooms by category, price, and rating.",
    icon: Search,
  },
  {
    href: "/saved",
    label: "Saved studios",
    description: "Pick up your shortlist for the next project.",
    icon: Heart,
  },
  {
    href: "/my-bookings",
    label: "Manage bookings",
    description: "Review requests and cancel pending slots.",
    icon: CalendarCheck,
  },
];

export function DashboardOverview() {
  const { user } = useAuth();

  const listingsQuery = useQuery({
    queryKey: ["studios", "mine"],
    queryFn: async (): Promise<Studio[]> => {
      const response = await api.get<{ studios: Studio[] }>("/studios/mine");
      return response.data.studios;
    },
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async (): Promise<Booking[]> => {
      const response = await api.get<{ bookings: Booking[] }>("/bookings/mine");
      return response.data.bookings;
    },
  });

  const savedQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<Studio[]> => {
      const response = await api.get<{ studios: Studio[] }>("/wishlist");
      return response.data.studios;
    },
  });

  const listings = listingsQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];
  const saved = savedQuery.data ?? [];
  const recentBookings = bookings.slice(0, 3);
  const firstName = user?.name.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Studio listings",
      value: listings.length,
      hint: "spaces you host",
      href: "/my-listings",
      icon: Building2,
      isPending: listingsQuery.isPending,
    },
    {
      label: "Bookings",
      value: bookings.length,
      hint: "requests and reservations",
      href: "/my-bookings",
      icon: CalendarCheck,
      isPending: bookingsQuery.isPending,
    },
    {
      label: "Saved studios",
      value: saved.length,
      hint: "on your shortlist",
      href: "/saved",
      icon: Heart,
      isPending: savedQuery.isPending,
    },
  ];

  const hasError =
    listingsQuery.error || bookingsQuery.error || savedQuery.error;

  function retryAll() {
    void listingsQuery.refetch();
    void bookingsQuery.refetch();
    void savedQuery.refetch();
  }

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-base-content/55">
            Your listings, booking requests, and saved spaces in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/add-studio"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add new studio
          </Link>
          <Link
            href="/studios"
            className={buttonStyles({ variant: "outline", size: "md" })}
          >
            Explore studios
          </Link>
        </div>
      </div>

      {hasError ? (
        <div className="mt-8">
          <ErrorState
            title="Some dashboard data did not load."
            description="We could not reach every part of your account. Try again to refresh your counts and activity."
            onRetry={retryAll}
          />
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, hint, href, icon: Icon, isPending }) => (
          <Link
            key={label}
            href={href}
            className="hover-lift group rounded-[1.5rem] border border-base-content/10 bg-base-100 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-base-200 text-base-content/55">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="size-4 -translate-x-1 text-base-content/25 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
            {isPending ? (
              <Skeleton className="mt-6 h-10 w-16" />
            ) : (
              <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
                {value}
              </p>
            )}
            <p className="mt-1 text-sm font-semibold">{label}</p>
            <p className="text-[0.68rem] text-base-content/40">{hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Recent bookings
              </h2>
              <p className="text-xs text-base-content/45">
                The latest requests across your account.
              </p>
            </div>
            <Link
              href="/my-bookings"
              className="text-xs font-semibold text-base-content/50 underline-offset-4 hover:text-base-content hover:underline"
            >
              View all
            </Link>
          </div>

          {bookingsQuery.isPending ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-base-content/10 p-3"
                >
                  <Skeleton className="size-14 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-base-content/15 bg-base-200/30 px-5 py-10 text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-base-100 text-base-content/40 shadow-sm">
                <CalendarX2 className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold">No bookings yet.</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-base-content/45">
                Once you request a studio, it will show up here with its status.
              </p>
              <Link
                href="/studios"
                className={buttonStyles({
                  variant: "outline",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Find a space
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-2">
              {recentBookings.map((booking) => (
                <li key={booking.id}>
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="group flex items-center gap-3 rounded-2xl border border-base-content/10 p-3 transition-colors hover:border-base-content/25 hover:bg-base-200/40"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-base-300">
                      <Image
                        src={booking.studioImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {booking.studioTitle}
                      </p>
                      <p className="mt-0.5 truncate text-[0.68rem] text-base-content/45">
                        {formatDate(booking.date, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {formatTime(booking.startTime)} –{" "}
                        {formatTime(booking.endTime)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Quick actions
            </h2>
            <div className="mt-4 space-y-2">
              {quickActions.map(({ href, label, description, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl border border-base-content/10 p-3 transition-colors hover:border-base-content/25 hover:bg-base-200/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-base-200 text-base-content/55">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-[0.68rem] text-base-content/45">
                      {description}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-3.5 shrink-0 text-base-content/25 transition-transform group-hover:translate-x-0.5 group-hover:text-base-content/50"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-base-content/10 bg-base-200/40 p-6">
            <div className="flex items-center gap-3">
              <Avatar
                name={user?.name ?? "Host"}
                photoURL={user?.photoURL}
                className="size-10 text-xs"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-[0.68rem] text-base-content/45">
                  {user?.email}
                </p>
              </div>
            </div>
            {listings.length > 0 ? (
              <p className="mt-4 text-xs leading-relaxed text-base-content/50">
                Your top listing is{" "}
                <Link
                  href={`/studios/${listings[0].id}`}
                  className="font-semibold text-base-content/70 underline-offset-4 hover:underline"
                >
                  {listings[0].title}
                </Link>{" "}
                at {formatCurrency(listings[0].hourlyRate)}/hr.
              </p>
            ) : (
              <p className="mt-4 text-xs leading-relaxed text-base-content/50">
                You have not published a studio yet. Add one to start receiving
                booking requests.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
