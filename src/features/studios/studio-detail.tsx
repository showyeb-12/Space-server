import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { BookingCard } from "@/features/bookings/booking-card";
import { GalleryCarousel } from "@/features/studios/gallery-carousel";
import { ReviewForm } from "@/features/studios/review-form";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Studio } from "@/types";

export function StudioDetail({ studio }: { studio: Studio }) {
  const specs = [
    {
      icon: Users,
      label: "Capacity",
      value: `${studio.capacity} people`,
    },
    {
      icon: Clock,
      label: "Minimum",
      value: "30 minutes",
    },
    {
      icon: ShieldCheck,
      label: "Deposit",
      value:
        studio.securityDeposit > 0
          ? formatCurrency(studio.securityDeposit)
          : "None",
    },
    {
      icon: MapPin,
      label: "Area",
      value: studio.location,
    },
  ];

  return (
    <div className="pb-28 lg:pb-20">
      <div className="container-shell py-6">
        <nav aria-label="Breadcrumb">
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/50 transition-colors hover:text-base-content"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All studios
          </Link>
        </nav>
      </div>

      <div className="container-shell grid gap-10 pb-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.72fr)] lg:gap-12">
        <div className="min-w-0">
          <GalleryCarousel studio={studio} />

          <div className="mt-8 flex flex-col gap-5 border-b border-base-content/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-base-200 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-base-content/60">
                {studio.category}
              </span>
              <div className="mt-4 flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                  {studio.title}
                </h1>
                <WishlistButton studioId={studio.id} className="mt-1 shrink-0" />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-base-content/55">
                <MapPin className="size-4" aria-hidden="true" />
                {studio.location}
              </p>
            </div>

            {studio.reviewCount > 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3">
                <span className="font-display text-3xl font-semibold tracking-tight">
                  {studio.rating.toFixed(1)}
                </span>
                <div>
                  <div className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={
                          index < Math.round(studio.rating)
                            ? "size-3 fill-current text-warning"
                            : "size-3 text-base-content/20"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[0.68rem] text-base-content/45">
                    {studio.reviewCount} review
                    {studio.reviewCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            ) : (
              <span className="w-fit rounded-full bg-base-200 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-base-content/50">
                New listing
              </span>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-base-content/10 bg-base-100 p-4"
              >
                <Icon
                  className="size-4 text-base-content/35"
                  aria-hidden="true"
                />
                <dt className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-base-content/40">
                  {label}
                </dt>
                <dd className="mt-1 truncate text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10" aria-labelledby="overview-heading">
            <h2
              id="overview-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              About the space
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-base-content/65 sm:text-base">
              {studio.overview}
            </p>
          </section>

          <section
            className="mt-10 border-t border-base-content/10 pt-10"
            aria-labelledby="amenities-heading"
          >
            <h2
              id="amenities-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              What is included
            </h2>
            {studio.amenities.length > 0 ? (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-xl border border-base-content/10 bg-base-100 px-4 py-3 text-sm font-medium text-base-content/70"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/25 text-base-content">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-base-content/50">
                Amenities are confirmed directly with the host.
              </p>
            )}
          </section>

          <section
            className="mt-10 border-t border-base-content/10 pt-10"
            aria-labelledby="host-heading"
          >
            <h2
              id="host-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Hosted by {studio.owner.name}
            </h2>
            <div className="mt-5 flex items-start gap-4 rounded-[1.5rem] border border-base-content/10 bg-base-100 p-5">
              <Avatar
                name={studio.owner.name}
                photoURL={studio.owner.photoURL}
                className="size-12 text-sm"
              />
              <div>
                <p className="font-semibold">{studio.owner.name}</p>
                <p className="mt-1 text-xs text-base-content/45">
                  Listing on StudioSpace since{" "}
                  {formatDate(studio.createdAt, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-base-content/60">
                  Every request goes directly to the host. They confirm the
                  details before your booking is locked in.
                </p>
              </div>
            </div>
          </section>

          <section
            className="mt-10 border-t border-base-content/10 pt-10"
            aria-labelledby="reviews-heading"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="reviews-heading"
                className="font-display text-2xl font-semibold tracking-tight"
              >
                Reviews
              </h2>
              {studio.reviewCount > 0 ? (
                <p className="text-xs font-semibold text-base-content/45">
                  {studio.reviewCount} total
                </p>
              ) : null}
            </div>

            {studio.reviews.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {studio.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-[1.25rem] border border-base-content/10 bg-base-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={review.name}
                          photoURL={review.photoURL}
                          className="size-9 text-[0.65rem]"
                        />
                        <div>
                          <p className="text-sm font-semibold">{review.name}</p>
                          <p className="text-[0.68rem] text-base-content/40">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={
                              index < review.rating
                                ? "size-3 fill-current text-warning"
                                : "size-3 text-base-content/15"
                            }
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-base-content/15 bg-base-200/40 px-5 py-8 text-center text-sm text-base-content/50">
                No reviews yet. This host is just getting started.
              </p>
            )}

            <ReviewForm studioId={studio.id} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <BookingCard studio={studio} />
        </aside>
      </div>
    </div>
  );
}
