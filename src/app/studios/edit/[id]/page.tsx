"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/features/auth/auth-guard";
import { StudioForm } from "@/features/studios/studio-form";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Studio } from "@/types";

function EditStudioSkeleton() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.7fr)]">
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-[1.75rem]" />
          <Skeleton className="h-64 rounded-[1.75rem]" />
        </div>
        <Skeleton className="h-56 rounded-[1.75rem]" />
      </div>
    </div>
  );
}

function EditStudioContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user } = useAuth();

  const studioQuery = useQuery({
    queryKey: ["studios", id],
    queryFn: async (): Promise<Studio> => {
      const response = await api.get<{ studio: Studio }>(`/studios/${id}`);
      return response.data.studio;
    },
    enabled: Boolean(id),
  });

  if (studioQuery.isPending) {
    return <EditStudioSkeleton />;
  }

  if (studioQuery.error) {
    const notFound =
      studioQuery.error instanceof ApiError && studioQuery.error.status === 404;

    return (
      <div className="container-shell py-16">
        <EmptyState
          icon={ShieldAlert}
          title={notFound ? "That listing is gone." : "We could not load the listing."}
          description={
            notFound
              ? "It may have been removed. Head back to your listings to manage the rest."
              : "Check your connection and try loading the listing again."
          }
          action={
            notFound ? (
              <Link
                href="/my-listings"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                Back to my listings
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void studioQuery.refetch()}
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                Try again
              </button>
            )
          }
        />
      </div>
    );
  }

  const studio = studioQuery.data;

  if (!studio || studio.owner.email !== user?.email) {
    return (
      <div className="container-shell py-16">
        <EmptyState
          icon={ShieldAlert}
          title="This listing is not yours to edit."
          description="You can only edit spaces listed under your own account. Your own listings are waiting in My Studio Listings."
          action={
            <Link
              href="/my-listings"
              className={buttonStyles({ variant: "primary", size: "sm" })}
            >
              Go to my listings
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-shell py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Edit listing</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
          Tune the details.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-base-content/55 sm:text-base">
          Keep the listing accurate so guests know exactly what they are booking.
          Changes go live as soon as you save.
        </p>
      </div>

      <div className="mt-10">
        <StudioForm studio={studio} />
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <AuthGuard>
      <EditStudioContent />
    </AuthGuard>
  );
}
