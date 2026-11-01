"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, RotateCw, TriangleAlert } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="relative grid size-20 place-items-center rounded-[1.5rem] border border-error/20 bg-error/10 text-error">
        <TriangleAlert className="size-8" aria-hidden="true" />
        <span
          className="absolute -inset-3 rounded-[1.75rem] border border-dashed border-error/15"
          aria-hidden="true"
        />
      </span>

      <p className="eyebrow mt-8">Cut to black</p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
        The take did not land.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/55">
        Something went wrong while loading this scene. Try again, or head back to
        the homepage and pick up from there.
      </p>

      {error.digest ? (
        <p className="mt-3 rounded-full bg-base-200 px-3 py-1 text-[0.65rem] font-semibold text-base-content/40">
          Reference {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Link
          href="/"
          className={buttonStyles({ variant: "outline", size: "lg" })}
        >
          <Home className="size-4" aria-hidden="true" />
          Return home
        </Link>
      </div>
    </section>
  );
}
