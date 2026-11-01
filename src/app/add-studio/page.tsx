import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/auth-guard";
import { StudioForm } from "@/features/studios/studio-form";

export const metadata: Metadata = {
  title: "List your studio",
  description:
    "Publish a creative space on StudioSpace and start receiving booking requests from creators.",
};

export default function AddStudioPage() {
  return (
    <AuthGuard>
      <div className="container-shell py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">New listing</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            Put your space on the map.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-base-content/55 sm:text-base">
            Add the details creators need to picture the room. You approve every
            booking request, so nothing gets locked in without you.
          </p>
        </div>

        <div className="mt-10">
          <StudioForm />
        </div>
      </div>
    </AuthGuard>
  );
}
