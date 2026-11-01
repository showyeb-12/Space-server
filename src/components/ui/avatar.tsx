import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  photoURL,
  className,
}: {
  name: string;
  photoURL?: string | null;
  className?: string;
}) {
  if (photoURL) {
    return (
      <span
        className={cn(
          "relative inline-flex size-9 shrink-0 overflow-hidden rounded-full bg-base-300",
          className,
        )}
      >
        <Image
          src={photoURL}
          alt={name}
          width={96}
          height={96}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-content",
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
