import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How StudioSpace connects creators with independent studio hosts, from discovery to a confirmed booking.",
};

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find the room",
    description:
      "Search by category, location, price, and rating. Every listing shows the same core details: capacity, rate, deposit, amenities, and real photos.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Request a slot",
    description:
      "Pick a date and a start and end time. Add a note for the host with crew size or setup needs. You will see an estimate before you send it.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "The host confirms",
    description:
      "Requests go straight to the host. They review the details and confirm. If the slot is already taken, the platform blocks the conflict before it reaches them.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Show up and make",
    description:
      "Once confirmed, your booking is locked into your account. Bring the idea, use the room, and get back to the work.",
  },
];

const creatorPoints = [
  "Browse five studio categories with honest hourly rates.",
  "Filter by price, category, and rating without losing your search.",
  "Request a specific time window and see the estimate first.",
  "Cancel a pending request if plans change.",
];

const hostPoints = [
  "Publish a listing in minutes with an uploaded cover image.",
  "Approve every booking request yourself.",
  "Set your own hourly rate, deposit, and capacity.",
  "Edit or remove a listing whenever you need to.",
];

const faqs = [
  {
    question: "When am I charged?",
    answer:
      "This demo build does not process payments. The booking request shows the estimated studio time and refundable deposit so both sides agree on the details before the session.",
  },
  {
    question: "Can two people book the same slot?",
    answer:
      "No. Before a request is saved, the platform checks for any confirmed or pending booking that overlaps the same studio, date, and time window. A conflict is rejected with a clear message.",
  },
  {
    question: "Who approves a booking?",
    answer:
      "The host. Every request starts as Pending and only becomes Confirmed when the host accepts it. You can withdraw a pending request from My Bookings.",
  },
  {
    question: "Can I save studios for later?",
    answer:
      "Yes. Tap the heart on a studio or save it from a listing, then find it again under Saved Studios. Your wishlist is private to your account.",
  },
  {
    question: "Can I edit a listing after it is live?",
    answer:
      "Yes. Head to My Studio Listings, choose Edit, and update the details, image, rate, or amenities. Changes go live immediately.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="container-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <div>
          <p className="eyebrow">
            <Clock className="size-3.5" aria-hidden="true" />
            How it works
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            From scroll to shoot in four clear steps.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-base-content/60 sm:text-base">
            No agency back-and-forth. No mystery fees. StudioSpace keeps the path
            from idea to booked room short, direct, and easy to follow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              Find a studio
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/register"
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-base-300">
          <Image
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80"
            alt="A film crew setting up in a studio"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-content">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/55">
                Built around people
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                A real host confirms every booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-base-content/10 bg-base-200/40">
        <div className="container-shell py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">The path</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              Four steps. No guesswork.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-base-content/55">
              The same flow works whether you are booking a room or listing one.
              Everyone sees the same details at the same time.
            </p>
          </div>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-[1.75rem] border border-base-content/10 bg-base-content/10 lg:grid-cols-2">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <li key={number} className="bg-base-100 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-semibold tracking-tight text-base-content/20">
                    {number}
                  </span>
                  <span className="grid size-10 place-items-center rounded-xl bg-base-200 text-base-content/55">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-7 font-display text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-base-content/55">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-base-content/10 bg-base-100 p-6 sm:p-8">
            <p className="eyebrow">For creators</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.04em]">
              Book the room, not the runaround.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-base-content/55">
              Find a space that fits the project, request the window you need, and
              keep track of every booking in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {creatorPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/30 text-base-content">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-base-content/65">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/studios"
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "mt-7",
              })}
            >
              Explore studios
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>

          <article className="rounded-[1.75rem] border border-base-content/10 bg-secondary p-6 text-secondary-content sm:p-8">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] opacity-55">
              For hosts
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.04em]">
              Your space. Your rules. Your calendar.
            </h2>
            <p className="mt-3 text-sm leading-relaxed opacity-65">
              Publish a listing without handing over control. You decide what is
              available and who walks through the door.
            </p>
            <ul className="mt-6 space-y-3">
              {hostPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed opacity-80">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/add-studio"
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "mt-7",
              })}
            >
              List your studio
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-t border-base-content/10">
        <div className="container-shell grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              The things people ask first.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-base-content/55">
              Still stuck? Email{" "}
              <a
                href="mailto:hello@studiospace.com"
                className="font-semibold text-base-content underline-offset-4 hover:underline"
              >
                hello@studiospace.com
              </a>{" "}
              and a real person will reply.
            </p>
          </div>

          <div className="divide-y divide-base-content/10 border-y border-base-content/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold sm:text-base">
                  {faq.question}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-base-content/15 text-base-content/45 transition-transform group-open:rotate-45">
                    <span className="relative block size-3" aria-hidden="true">
                      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                    </span>
                  </span>
                </summary>
                <p className="max-w-xl pb-6 pr-10 text-sm leading-7 text-base-content/55">
                  {faq.answer}
                </p>
              </details>
            ))}
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
              Ready when you are
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl">
              The right room is one search away.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/studios"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                Browse studios
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
