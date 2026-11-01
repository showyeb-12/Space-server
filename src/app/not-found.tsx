import Link from "next/link";
import { Aperture, ArrowLeft, Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="relative">
        <p
          className="select-none font-display text-[8rem] font-semibold leading-none tracking-[-0.08em] text-base-content/[0.07] sm:text-[11rem]"
          aria-hidden="true"
        >
          404
        </p>
        <span className="absolute inset-0 grid place-items-center">
          <span className="relative grid size-24 place-items-center rounded-[1.75rem] border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/5 sm:size-28">
            <Aperture
              className="size-10 text-base-content/65 sm:size-12"
              aria-hidden="true"
            />
            <span
              className="absolute -inset-3 rounded-[2rem] border border-dashed border-base-content/10"
              aria-hidden="true"
            />
            <span
              className="absolute -right-2 -top-2 size-3 rounded-full bg-primary"
              aria-hidden="true"
            />
          </span>
        </span>
      </div>

      <p className="eyebrow mt-10">Scene not found</p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
        This set is empty.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/55">
        The page you were looking for moved, wrapped, or never made it to the
        call sheet. The studios are still right where you left them.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={buttonStyles({ variant: "primary", size: "lg" })}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return home
        </Link>
        <Link
          href="/studios"
          className={buttonStyles({ variant: "outline", size: "lg" })}
        >
          <Search className="size-4" aria-hidden="true" />
          Explore studios
        </Link>
      </div>
    </section>
  );
}
