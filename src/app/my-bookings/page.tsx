import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/auth-guard";
import { MyBookings } from "@/features/bookings/my-bookings";

export const metadata: Metadata = {
  title: "My bookings",
  description: "Track your studio booking requests and reservations.",
};

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <div className="container-shell py-12 sm:py-16">
        <div className="max-w-xl">
          <p className="eyebrow">Your calendar</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            My bookings.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-base-content/55">
            Every request in one place. Pending requests can be withdrawn until
            the host confirms them.
          </p>
        </div>

        <MyBookings />
      </div>
    </AuthGuard>
  );
}
