import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  Check,
  Clapperboard,
  Mic,
  Music,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { HeroCarousel } from "@/features/home/hero-carousel";
import { FeaturedStudios } from "@/features/home/featured-studios";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonStyles } from "@/components/ui/button";
import {
  CATEGORY_DESCRIPTIONS,
  STUDIO_CATEGORIES,
  type StudioCategory,
} from "@/lib/constants";

const categoryMeta: Record<
  StudioCategory,
  { icon: typeof Camera; className: string }
> = {
  "Photo Studio": {
    icon: Camera,
    className: "bg-primary text-primary-content",
  },
  "Film Stage": {
    icon: Clapperboard,
    className: "bg-secondary text-secondary-content",
  },
  "Podcast Lounge": {
    icon: Mic,
    className: "bg-accent text-accent-content",
  },
  "Music Suite": {
    icon: Music,
    className: "bg-base-200 text-base-content",
  },
  Workshop: {
    icon: Wrench,
    className: "bg-base-300 text-base-content",
  },
};

const workflow = [
  {
    number: "01",
    title: "Find your space",
    description: "Filter by type, location, price, and the details that matter.",
    icon: Search,
  },
  {
    number: "02",
    title: "Pick a slot",
    description: "See hourly rates and request the exact window you need.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Confirm with the host",
    description: "Every booking is approved by a real person. No surprises.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Make something",
    description: "Show up, shoot, record, rehearse. That is the whole point.",
    icon: Sparkles,
  },
];

const hostBenefits = [
  "You approve every booking request.",
  "Set your own hourly rate and deposit.",
  "Edit, pause, or remove a listing anytime.",
];

export default function Home() {
  return (
    <>
      <section className="container-shell pt-5 sm:pt-8">
        <div className="overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]">
          <HeroCarousel />
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <SectionHeading
          eyebrow="Browse by discipline"
          title="Five kinds of rooms. One place to find them."
          description="From daylight photo lofts to rooms built for sound, start with the kind of work you are making."
          action={
            <Link
              href="/studios"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              View all studios
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STUDIO_CATEGORIES.map((category) => {
            const meta = categoryMeta[category];
            const Icon = meta.icon;

            return (
              <Link
                key={category}
                href={`/studios?category=${encodeURIComponent(category)}`}
                className={`group hover-lift relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 ${meta.className}`}
              >
                <div
                  className="absolute -right-10 -top-10 size-32 rounded-full border-[18px] border-current opacity-10 transition-transform duration-500 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-current/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">
                    {category}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-65">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-base-content/10 bg-base-200/40">
        <div className="container-shell py-20 sm:py-24">
          <SectionHeading
            eyebrow="Featured this week"
            title="Spaces with a little extra pull."
            description="Hand-picked rooms with strong reviews, thoughtful details, and hosts who care about the work."
            action={
              <Link
                href="/studios?sort=rating"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                Browse by rating
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10">
            <FeaturedStudios />
          </div>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From scroll to shoot in four steps."
          description="No agency back-and-forth, no mystery fees. Just a clear path from idea to booked room."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.number} className="bg-base-100 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-semibold tracking-tight text-base-content/20">
                    {step.number}
                  </span>
                  <Icon className="size-5 text-base-content/40" aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="bg-secondary text-secondary-content">
        <div className="container-shell grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] opacity-55">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              For hosts
            </p>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              Your space. Your rules. Your calendar.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed opacity-65 sm:text-base">
              StudioSpace gives independent hosts the tools to list a room
              without handing over control. You decide what is available and
              who walks through the door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/add-studio"
                className={buttonStyles({ variant: "primary", size: "lg" })}
              >
                List your studio
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
                  className:
                    "border border-secondary-content/20 text-secondary-content hover:bg-secondary-content/10",
                })}
              >
                How hosting works
              </Link>
            </div>
          </div>

          <ul className="space-y-3">
            {hostBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-2xl border border-secondary-content/15 bg-secondary-content/5 p-4"
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-relaxed opacity-85">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-primary-content sm:px-12 sm:py-20">
          <div
            className="absolute -right-20 -top-24 size-72 rounded-full border-[38px] border-primary-content/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 left-1/3 size-64 rounded-full border-[32px] border-primary-content/10"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] opacity-55">
              Your next project
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              The right room is closer than you think.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed opacity-70 sm:text-base">
              Find a space, request a slot, and get back to making the thing.
              It really can be this simple.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studios"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                })}
              >
                Explore studios
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
                  className:
                    "border border-primary-content/25 text-primary-content hover:bg-primary-content/10",
                })}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
