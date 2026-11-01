"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";

const accountLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/saved", label: "Saved Studios", icon: Heart },
];

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="btn h-auto min-h-0 gap-2 rounded-full border border-base-content/10 bg-base-100 px-1.5 py-1.5 hover:bg-base-200"
        aria-label="Open account menu"
      >
        <Avatar
          name={user.name}
          photoURL={user.photoURL}
          className="size-8 text-[0.65rem]"
        />
        <span className="hidden max-w-24 truncate text-xs font-semibold lg:block">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className="hidden size-3.5 text-base-content/45 lg:block"
          aria-hidden="true"
        />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-3 w-64 rounded-2xl border border-base-content/10 bg-base-100 p-2 shadow-xl"
      >
        <li className="menu-title">
          <span className="truncate text-[0.68rem] font-semibold normal-case tracking-normal text-base-content/45">
            Signed in as{" "}
            <span className="text-base-content/70">{user.email}</span>
          </span>
        </li>

        {accountLinks.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="gap-3 rounded-xl text-sm font-medium">
              <Icon className="size-4 text-base-content/55" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}

        <li className="my-1">
          <div className="h-px bg-base-content/10" role="separator" />
        </li>

        <li>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-3 rounded-xl text-sm font-medium text-error"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {isLoggingOut ? "Signing out…" : "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
}
