"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Aperture } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

function ProtectedLoader({ label }: { label: string }) {
  return (
    <section className="container-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="relative grid size-16 place-items-center rounded-[1.25rem] border border-base-content/10 bg-base-100 shadow-sm">
        <Aperture
          className="size-7 animate-spin text-base-content/60"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-primary/30"
          aria-hidden="true"
        />
      </span>
      <p className="mt-5 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs text-base-content/45">
        One moment while we check your session.
      </p>
    </section>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || user) return;

    const next = `${pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [isLoading, pathname, router, user]);

  if (isLoading) {
    return <ProtectedLoader label="Checking your account" />;
  }

  if (!user) {
    return <ProtectedLoader label="Taking you to sign in" />;
  }

  return <>{children}</>;
}
