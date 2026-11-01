import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <div className="container-shell py-8">
      <Skeleton className="h-4 w-28 rounded-full" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.72fr)]">
        <div>
          <Skeleton className="aspect-[16/9] w-full rounded-[1.5rem]" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-8 h-4 w-24 rounded-full" />
          <Skeleton className="mt-4 h-12 w-3/4 rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-48 rounded-full" />
          <div className="mt-8 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="mt-10 h-6 w-48 rounded-full" />
          <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        </div>
        <Skeleton className="hidden h-[28rem] rounded-[1.75rem] lg:block" />
      </div>
    </div>
  );
}
