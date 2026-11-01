import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/auth-guard";
import { DashboardOverview } from "@/features/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your StudioSpace listings, bookings, and saved studios.",
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container-shell py-12 sm:py-16">
        <DashboardOverview />
      </div>
    </AuthGuard>
  );
}
