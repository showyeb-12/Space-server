import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Studio } from "@/types";

export function StudioCard({
  studio,
  priority = false,
}: {
  studio: Studio;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/studios/${studio.id}`}
      className="group hover-lift flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-base-300">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-base-100/90 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-base-content backdrop-blur">
          {studio.category}
        </span>
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-base-100/90 text-base-content opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight">
            {studio.title}
          </h3>
          {studio.reviewCount > 0 ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold">
              <Star
                className="size-3.5 fill-current text-warning"
                aria-hidden="true"
              />
              {studio.rating.toFixed(1)}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-base-200 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-base-content/50">
              New
            </span>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-base-content/50">
          <MapPin className="size-3.5" aria-hidden="true" />
          {studio.location}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <p>
            <span className="font-display text-xl font-semibold tracking-tight">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="ml-0.5 text-xs text-base-content/45">/hr</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-base-content/50">
            <Users className="size-3.5" aria-hidden="true" />
            {studio.capacity} people
          </p>
        </div>
      </div>
    </Link>
  );
}
