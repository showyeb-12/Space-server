import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container-shell pt-5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-base-300">
        <Skeleton className="aspect-[16/10] rounded-none absolute inset-0" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="mt-8 max-w-xl">
        <Skeleton className="h-6 w-3/4 rounded-md mb-4" aria-hidden="true" />
        <Skeleton className="h-5 w-4/5 rounded-md mb-6" aria-hidden="true" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-20 rounded-full" aria-hidden="true" />
          <Skeleton className="h-4 w-12 rounded-full" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-10 grid gap-4">
        <Skeleton className="h-6 w-2/3 rounded-2xl" aria-hidden="true" />
        <Skeleton className="h-6 w-1/2 rounded-2xl" aria-hidden="true" />
        <Skeleton className="h-6 w-1/3 rounded-2xl" aria-hidden="true" />
      </div>
    </section>
  );
}