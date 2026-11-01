import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/register-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join StudioSpace to book creative studios, save favorites, and list your own space.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-full" />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
