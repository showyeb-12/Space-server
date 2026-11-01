"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { StudioCardSkeleton } from "@/components/ui/skeleton";
import { StudioCard } from "@/features/studios/studio-card";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { api } from "@/lib/api";
import type { Studio } from "@/types";

export function SavedStudios() {
  const savedQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<Studio[]> => {
      const response = await api.get<{ studios: Studio[] }>("/wishlist");
      return response.data.studios;
    },
  });

  if (savedQuery.isPending) {
    return (
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (savedQuery.error) {
    return (
      <div className="mt-8">
        <ErrorState
          title="Saved studios did not load."
          description="We could not reach your wishlist. Check your connection and try again."
          onRetry={() => void savedQuery.refetch()}
        />
      </div>
    );
  }

  const studios = savedQuery.data;

  if (studios.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={Heart}
          title="Nothing saved yet."
          description="Tap the heart on a studio you love and it will wait for you here, ready when the next project lands."
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
      <p className="mt-6 text-xs font-semibold text-base-content/45">
        {studios.length} saved studio{studios.length === 1 ? "" : "s"} · only
        visible to you
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {studios.map((studio) => (
          <div key={studio.id} className="relative">
            <StudioCard studio={studio} />
            <WishlistButton
              studioId={studio.id}
              nextPath="/saved"
              className="absolute right-3 top-3 z-10 border-base-100/40 bg-base-100/90 backdrop-blur"
            />
          </div>
        ))}
      </div>
    </>
  );
}
