"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  LayoutGrid,
  MapPin,
  Pencil,
  Plus,
  Star,
  Table as TableIcon,
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
import { cn, formatCurrency } from "@/lib/utils";
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
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
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
      toast.success("Studio listing deleted successfully.");
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

  const listings = listingsQuery.data ?? [];

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
              Add New Studio
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* View Switcher Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-base-content/10 pb-4">
        <p className="text-xs font-semibold text-base-content/50">
          Showing {listings.length} studio listing{listings.length === 1 ? "" : "s"}
        </p>

        <div className="flex items-center gap-2">
          <div className="join rounded-full border border-base-content/15 bg-base-100 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              aria-label="Card view"
              className={cn(
                "join-item btn btn-xs rounded-full gap-1.5 px-3 font-semibold",
                viewMode === "card"
                  ? "btn-neutral"
                  : "btn-ghost text-base-content/60",
              )}
            >
              <LayoutGrid className="size-3.5" aria-hidden="true" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Table view"
              className={cn(
                "join-item btn btn-xs rounded-full gap-1.5 px-3 font-semibold",
                viewMode === "table"
                  ? "btn-neutral"
                  : "btn-ghost text-base-content/60",
              )}
            >
              <TableIcon className="size-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
          </div>

          <Link
            href="/add-studio"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            <span>Add Studio</span>
          </Link>
        </div>
      </div>

      {viewMode === "table" ? (
        /* Table Format */
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-content/10 text-xs uppercase tracking-wider text-base-content/50">
                  <th className="py-4 pl-6">Studio</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Hourly Rate</th>
                  <th>Capacity</th>
                  <th>Rating</th>
                  <th className="pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5">
                {listings.map((studio) => (
                  <tr key={studio.id} className="hover:bg-base-200/40 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-base-300">
                          <Image
                            src={studio.imageUrl}
                            alt={studio.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/studios/${studio.id}`}
                            className="font-display font-semibold hover:text-primary transition-colors line-clamp-1"
                          >
                            {studio.title}
                          </Link>
                          <p className="text-[0.68rem] text-base-content/40">
                            ID: {studio.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline font-medium">
                        {studio.category}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-base-content/40" aria-hidden="true" />
                        {studio.location}
                      </span>
                    </td>
                    <td className="font-semibold text-sm">
                      {formatCurrency(studio.hourlyRate)}
                      <span className="text-xs font-normal text-base-content/40">/hr</span>
                    </td>
                    <td className="text-xs text-base-content/70">
                      <span className="flex items-center gap-1">
                        <Users className="size-3 text-base-content/40" aria-hidden="true" />
                        {studio.capacity}
                      </span>
                    </td>
                    <td>
                      {studio.reviewCount > 0 ? (
                        <span className="flex items-center gap-1 text-xs font-semibold">
                          <Star className="size-3 fill-current text-warning" aria-hidden="true" />
                          {studio.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="badge badge-xs badge-ghost">New</span>
                      )}
                    </td>
                    <td className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/studios/edit/${studio.id}`}
                          className="btn btn-outline btn-xs gap-1 rounded-full font-semibold"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          <span>Update</span>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 rounded-full text-error hover:bg-error/10"
                          onClick={() => setListingToDelete(studio)}
                        >
                          <Trash2 className="size-3" aria-hidden="true" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Format */
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                  <h2 className="line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight hover:text-primary transition-colors">
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
                      className: "flex-1 gap-1.5",
                    })}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    <span>Update</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 border-error/30 text-error hover:bg-error/10 hover:border-error"
                    onClick={() => setListingToDelete(studio)}
                    aria-label={`Delete ${studio.title}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </Button>
                  <Link
                    href={`/studios/${studio.id}`}
                    className={buttonStyles({
                      variant: "ghost",
                      size: "sm",
                      className: "px-2.5",
                    })}
                    aria-label={`View ${studio.title}`}
                    title="View live listing"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(listingToDelete)}
        onClose={() => setListingToDelete(null)}
        onConfirm={() => {
          if (listingToDelete) deleteMutation.mutate(listingToDelete.id);
        }}
        title="Delete this studio listing?"
        description={
          listingToDelete
            ? `"${listingToDelete.title}" will be permanently removed from MongoDB and Explore Studios. Existing bookings remain intact, but this listing deletion cannot be undone.`
            : ""
        }
        confirmLabel="Delete Studio"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
