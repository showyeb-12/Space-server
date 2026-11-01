import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About us",
  description:
    "StudioSpace is a peer-to-peer marketplace for creative studios, built around host control and honest details.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Hosts stay in control",
    description:
      "Every booking request is approved by a real person. Hosts set the rate, the deposit, and the calendar.",
  },
  {
    icon: Camera,
    title: "Details you can trust",
    description:
      "Real photos, honest capacities, and clear amenities. You should know what the room is before you book it.",
  },
  {
    icon: HeartHandshake,
    title: "Built for the work",
    description:
      "No agency layer, no mystery fees. Just a direct line between the people making things and the spaces that make it possible.",
  },
];

const stats = [
  { value: "5", label: "space types" },
  { value: "100%", label: "host-approved bookings" },
  { value: "0", label: "mystery fees" },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div>
          <p className="eyebrow">
            <Sparkles className="size-3.5" aria-hidden="true" />
            About StudioSpace
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            A calmer backlot for people who make things.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-base-content/60 sm:text-base">
            StudioSpace is a peer-to-peer marketplace for creative space. We
            connect independent hosts with photographers, filmmakers, podcasters,
            musicians, and makers who need the right room for the work.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/60 sm:text-base">
            The idea is simple: make booking a studio feel as considered as the
            work itself. Clear details, direct conversations, and no one guessing
            what happens next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              Explore studios
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/add-studio"
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              List your space
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-base-300">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="A bright creative studio with natural light and open workspace"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/55">
                  The backlot
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">
                  Independent rooms. Serious work.
                </p>
              </div>
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-base-content/10 bg-base-200/40">
        <div className="container-shell grid gap-px overflow-hidden py-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center sm:py-2">
              <p className="font-display text-4xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-base-content/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">What we believe</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
            Good space is personal.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/55 sm:text-base">
            The best rooms are not the biggest or the flashiest. They are the ones
            that fit the way you work. Our job is to make finding them feel
            human.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/25 text-base-content">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-base-content/10 bg-secondary text-secondary-content">
        <div className="container-shell py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] opacity-55">
                Why we built this
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                Less admin. More making.
              </h2>
            </div>
            <div className="space-y-5 text-sm leading-7 opacity-70 sm:text-base">
              <p>
                Booking a space used to mean scattered DMs, outdated PDFs, and
                asking the same questions over and over. Hosts were left managing
                calendars by hand. Creators were left hoping the room looked like
                the photos.
              </p>
              <p>
                StudioSpace puts the details in one place. Hosts publish what
                they actually offer. Creators request a specific window. Both
                sides see the same information before anything is confirmed.
              </p>
              <p className="border-l-2 border-primary pl-5 font-medium opacity-90">
                “A good studio day starts before you walk in the door. We want
                the booking to feel that way too.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div id="terms" className="scroll-mt-28">
            <p className="eyebrow">Terms</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.04em]">
              The short version.
            </h2>
            <p className="mt-4 text-sm leading-7 text-base-content/55">
              StudioSpace is a marketplace that connects hosts and guests. The
              host is responsible for the space and the terms of the booking. The
              guest is responsible for showing up on time and leaving the room as
              they found it. Booking requests are not confirmed until the host
              approves them.
            </p>
            <p className="mt-3 text-sm leading-7 text-base-content/55">
              This demo build does not process payments. Rates and deposits are
              shown to help both sides agree on the details before the session.
            </p>
          </div>

          <div id="privacy" className="scroll-mt-28">
            <p className="eyebrow">Privacy</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.04em]">
              What we store, and why.
            </h2>
            <p className="mt-4 text-sm leading-7 text-base-content/55">
              We store the account details you provide, the listings you publish,
              and the bookings you request so the platform can work. Your session
              lives in an HTTP-only cookie. Passwords are hashed, never stored in
              plain text.
            </p>
            <p className="mt-3 text-sm leading-7 text-base-content/55">
              Saved studios are private to your account. We do not sell your data.
              For questions about this demo, contact{" "}
              <a
                href="mailto:hello@studiospace.com"
                className="font-semibold text-base-content underline-offset-4 hover:underline"
              >
                hello@studiospace.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell pb-20 sm:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-primary-content sm:px-12 sm:py-16">
          <div
            className="absolute -right-16 -top-20 size-64 rounded-full border-[34px] border-primary-content/10"
            aria-hidden="true"
          />
          <div className="relative max-w-xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] opacity-55">
              Come make something
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl">
              Find the room. Bring the idea.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/studios"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                Explore studios
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
                  className:
                    "border border-primary-content/25 text-primary-content hover:bg-primary-content/10",
                })}
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
