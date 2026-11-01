import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/constants";

const statusClasses: Record<BookingStatus, string> = {
  Pending: "bg-warning/15 text-warning",
  Confirmed: "bg-success/15 text-success",
  Completed: "bg-info/15 text-info",
  Cancelled: "bg-error/15 text-error",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "badge h-auto gap-1.5 border-none px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em]",
        statusClasses[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
