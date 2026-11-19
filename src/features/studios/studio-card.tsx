"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { formatCurrency } from "@/lib/utils";
import type { Studio } from "@/types";

export function StudioCard({
  studio,
  priority = false,
  showWishlist = true,
}: {
  studio: Studio;
  priority?: boolean;
  showWishlist?: boolean;
}) {
  return (
    <article className="group hover-lift flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100 transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-300">
        <Link
          href={`/studios/${studio.id}`}
          className="relative block size-full overflow-hidden"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={studio.imageUrl}
            alt={studio.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Category badge */}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-base-100/90 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-base-content backdrop-blur">
          {studio.category}
        </span>

        {/* Wishlist heart button */}
        {showWishlist ? (
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton
              studioId={studio.id}
              className="border-base-100/40 bg-base-100/90 backdrop-blur shadow-sm hover:scale-105 transition-transform"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/studios/${studio.id}`}
            className="transition-colors hover:text-primary"
          >
            <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight">
              {studio.title}
            </h3>
          </Link>

          {studio.reviewCount > 0 ? (
            <span
              className="flex shrink-0 items-center gap-1 rounded-full bg-base-200/80 px-2 py-0.5 text-xs font-semibold"
              title={`${studio.rating.toFixed(1)} rating from ${studio.reviewCount} reviews`}
            >
              <Star
                className="size-3.5 fill-current text-warning"
                aria-hidden="true"
              />
              <span>{studio.rating.toFixed(1)}</span>
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-base-200 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-base-content/50">
              New
            </span>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-base-content/50">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{studio.location}</span>
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-base-content/10 pt-4">
          <div>
            <span className="font-display text-xl font-semibold tracking-tight">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="ml-0.5 text-xs text-base-content/45">/hr</span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-base-content/50">
            <Users className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{studio.capacity} guests</span>
          </p>
        </div>

        <div className="mt-4 pt-1">
          <Link
            href={`/studios/${studio.id}`}
            className="btn btn-outline btn-sm w-full gap-2 rounded-full border-base-content/15 font-semibold transition-all hover:border-base-content hover:bg-base-content hover:text-base-100"
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
