"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import {
  InstagramIcon,
  LinkedInIcon,
} from "@/components/brand/social-icons";
import { XIcon } from "@/components/brand/x-icon";
import { Button } from "@/components/ui/button";
import { STUDIO_CATEGORIES } from "@/lib/constants";

const companyLinks = [
  { href: "/register", label: "Sign Up / Register" },
  { href: "/login", label: "Login" },
  { href: "/about", label: "About us" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/studios", label: "Explore studios" },
  { href: "/add-studio", label: "List your studio" },
];

const socialLinks = [
  { href: "https://x.com", label: "StudioSpace on X", icon: XIcon },
  {
    href: "https://instagram.com",
    label: "StudioSpace on Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://linkedin.com",
    label: "StudioSpace on LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "mailto:hello@studiospace.com",
    label: "Email StudioSpace",
    icon: Mail,
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("You are on the list.", {
      description: "We will send the occasional studio drop. No spam.",
    });
    setEmail("");
    setIsSubmitting(false);
  }

  return (
    <footer className="border-t border-base-content/10 bg-base-200/60">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-base-content/60">
            A calmer way to find, book, and list creative spaces. Built for the
            people who make things.
          </p>
          <div className="mt-6 flex gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-base-content/10 text-base-content/55 transition-colors hover:border-base-content/30 hover:text-base-content"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-base-content/40">
            Explore
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {STUDIO_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  className="text-base-content/60 transition-colors hover:text-base-content"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-base-content/40">
            Company
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base-content/60 transition-colors hover:text-base-content"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-base-content/40">
            Studio notes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/60">
            New spaces, host stories, and booking tips. Once a month, maybe
            less.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <div className="join w-full">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="input input-bordered join-item w-full border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
                autoComplete="email"
              />
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                className="join-item rounded-l-none px-4"
                aria-label="Subscribe to the newsletter"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-base-content/10">
        <div className="container-shell flex flex-col gap-3 py-6 text-xs text-base-content/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
          <p>
            Made for creators, by creators.{" "}
            <Link href="/about#terms" className="link link-hover">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/about#privacy" className="link link-hover">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
