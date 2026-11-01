import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to StudioSpace to book studios and manage your listings.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
