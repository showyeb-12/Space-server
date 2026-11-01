import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-shell grid min-h-[calc(100dvh-5rem)] gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-secondary text-secondary-content lg:flex lg:flex-col lg:justify-between">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between gap-4 p-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            StudioSpace
          </span>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/65 transition-colors hover:text-white"
          >
            Browse studios
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative z-10 p-8">
          <p className="max-w-md font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white">
            The room is only the beginning.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Find a space that fits the work, book it without the back-and-forth,
            and get back to making the thing.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Photo", "Film", "Podcast", "Music", "Workshop"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold text-white/65 backdrop-blur"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
