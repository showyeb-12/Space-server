"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const mobileAccountLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/saved", label: "Saved Studios", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) setIsMobileOpen(false);
    };

    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function handleMobileLogout() {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setIsMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/80 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "text-base-content"
                  : "text-base-content/55 hover:text-base-content",
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-4 bottom-0.5 h-0.5 rounded-full bg-primary transition-opacity",
                  isActive(link.href)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-50",
                )}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {isLoading ? (
            <div
              className="skeleton size-9 rounded-full"
              aria-label="Loading account"
            />
          ) : user ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                Get started
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="btn btn-ghost btn-circle btn-sm border border-base-content/10 lg:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-base-content/10 bg-base-100/95 backdrop-blur-xl lg:hidden"
        >
          <div className="container-shell flex flex-col gap-1 py-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-base-200 text-base-content"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content",
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-base-content/10 pt-4">
              {user ? (
                <>
                  <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-base-content/40">
                    Your account
                  </p>
                  {mobileAccountLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content"
                    >
                      <Icon
                        className="size-4 text-base-content/50"
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    disabled={isLoggingOut}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-error transition-colors hover:bg-error/10"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    {isLoggingOut ? "Signing out…" : "Logout"}
                  </button>
                </>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className={buttonStyles({ variant: "outline" })}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileOpen(false)}
                    className={buttonStyles({ variant: "primary" })}
                  >
                    Create an account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
