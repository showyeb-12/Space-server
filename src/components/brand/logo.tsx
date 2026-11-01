import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-offset-4",
        className,
      )}
      aria-label="StudioSpace home"
    >
      <span className="grid size-9 place-items-center rounded-[0.7rem] bg-primary text-primary-content shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:rotate-12">
        <Aperture className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.045em]">
        Studio
        <span className="text-base-content/45">Space</span>
      </span>
    </Link>
  );
}
