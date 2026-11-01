"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Studio } from "@/types";

function ListingsSkeleton() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyListings() {
  const queryClient = useQueryClient();
  const [listingToDelete, setListingToDelete] = useState<Studio | null>(null);

  const listingsQuery = useQuery({
    queryKey: ["studios", "mine"],
    queryFn: async (): Promise<Studio[]> => {
      const response = await api.get<{ studios: Studio[] }>("/studios/mine");
      return response.data.studios;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (studioId: string) => {
      const response = await api.delete<{ id: string }>(`/studios/${studioId}`);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studios"] }),
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
      ]);
      setListingToDelete(null);
      toast.success("Listing deleted.");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not delete this listing. Please try again.",
      );
    },
  });

  if (listingsQuery.isPending) {
    return <ListingsSkeleton />;
  }

  if (listingsQuery.error) {
    return (
      <div className="mt-8">
        <ErrorState
          title="Your listings did not load."
          description="We could not reach your studio listings. Check your connection and try again."
          onRetry={() => void listingsQuery.refetch()}
        />
      </div>
    );
  }

  const listings = listingsQuery.data;

  if (listings.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={Building2}
          title="No listings yet."
          description="Your spaces are the whole point. Publish your first studio and start taking booking requests."
          action={
            <Link
              href="/add-studio"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add a studio
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((studio) => (
          <article
            key={studio.id}
            className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100"
          >
            <Link
              href={`/studios/${studio.id}`}
              className="relative block aspect-[4/3] overflow-hidden bg-base-300"
            >
              <Image
                src={studio.imageUrl}
                alt={studio.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-base-100/90 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] backdrop-blur">
                {studio.category}
              </span>
              {studio.reviewCount > 0 ? (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-base-100/90 px-2.5 py-1 text-[0.65rem] font-bold backdrop-blur">
                  <Star className="size-3 fill-current text-warning" aria-hidden="true" />
                  {studio.rating.toFixed(1)}
                </span>
              ) : (
                <span className="absolute right-3 top-3 rounded-full bg-base-100/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-base-content/60 backdrop-blur">
                  New
                </span>
              )}
            </Link>

            <div className="flex flex-1 flex-col p-5">
              <Link href={`/studios/${studio.id}`}>
                <h2 className="line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight">
                  {studio.title}
                </h2>
              </Link>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-base-content/50">
                <MapPin className="size-3.5" aria-hidden="true" />
                {studio.location}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-base-content/40">
                    Rate
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {formatCurrency(studio.hourlyRate)}
                    <span className="text-[0.68rem] font-normal text-base-content/45">
                      /hr
                    </span>
                  </p>
                </div>
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-base-content/40">
                    Capacity
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold">
                    <Users className="size-3.5 text-base-content/45" aria-hidden="true" />
                    {studio.capacity}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-5">
                <Link
                  href={`/studios/edit/${studio.id}`}
                  className={buttonStyles({
                    variant: "primary",
                    size: "sm",
                    className: "flex-1",
                  })}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </Link>
                <Link
                  href={`/studios/${studio.id}`}
                  className={buttonStyles({
                    variant: "outline",
                    size: "sm",
                    className: "flex-1",
                  })}
                  aria-label={`View ${studio.title}`}
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  View
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 text-error hover:bg-error/10"
                  onClick={() => setListingToDelete(studio)}
                  aria-label={`Delete ${studio.title}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(listingToDelete)}
        onClose={() => setListingToDelete(null)}
        onConfirm={() => {
          if (listingToDelete) deleteMutation.mutate(listingToDelete.id);
        }}
        title="Delete this listing?"
        description={
          listingToDelete
            ? `"${listingToDelete.title}" will be removed from Explore Studios. Existing bookings are not affected, and this cannot be undone.`
            : ""
        }
        confirmLabel="Delete listing"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
