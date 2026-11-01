import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/auth-guard";
import { SavedStudios } from "@/features/wishlist/saved-studios";

export const metadata: Metadata = {
  title: "Saved studios",
  description: "The creative spaces you have saved for later.",
};

export default function SavedPage() {
  return (
    <AuthGuard>
      <div className="container-shell py-12 sm:py-16">
        <div className="max-w-xl">
          <p className="eyebrow">Wishlist</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            Saved studios.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-base-content/55">
            A shortlist for the next shoot, session, or rehearsal. Save a space
            now and come back when the dates are set.
          </p>
        </div>

        <SavedStudios />
      </div>
    </AuthGuard>
  );
}
