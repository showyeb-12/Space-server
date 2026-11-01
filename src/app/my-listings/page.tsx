import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { AuthGuard } from "@/features/auth/auth-guard";
import { MyListings } from "@/features/studios/my-listings";

export const metadata: Metadata = {
  title: "My studio listings",
  description: "Manage the creative spaces you list on StudioSpace.",
};

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <div className="container-shell py-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Hosting</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              My studio listings.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-base-content/55">
              Keep your spaces up to date, adjust rates, or take a listing down.
              Every booking request still comes to you first.
            </p>
          </div>
          <Link
            href="/add-studio"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add new studio
          </Link>
        </div>

        <MyListings />
      </div>
    </AuthGuard>
  );
}
