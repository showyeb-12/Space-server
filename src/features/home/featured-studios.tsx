"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Camera, RefreshCw, WifiOff } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StudioCardSkeleton } from "@/components/ui/skeleton";
import { StudioCard } from "@/features/studios/studio-card";
import { api } from "@/lib/api";
import type { Studio } from "@/types";

export function FeaturedStudios() {
  const featuredQuery = useQuery({
    queryKey: ["studios", "featured"],
    queryFn: async () => {
      const response = await api.get<{ studios: Studio[] }>(
        "/studios/featured",
      );
      return response.data.studios;
    },
  });

  if (featuredQuery.isPending) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (featuredQuery.isError) {
    return (
      <EmptyState
        icon={WifiOff}
        title="The studios did not load"
        description="The API may be taking a quick break. Try again in a moment."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void featuredQuery.refetch()}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        }
      />
    );
  }

  if (!featuredQuery.data || featuredQuery.data.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="New spaces are on the way"
        description="We are curating the next batch of studios. Check back soon, or explore everything available now."
        action={
          <Link
            href="/studios"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            Explore all studios
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featuredQuery.data.map((studio, index) => (
        <StudioCard key={studio.id} studio={studio} priority={index < 3} />
      ))}
    </div>
  );
}
