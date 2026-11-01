"use client";

import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/providers/auth-provider";
import { AppToaster } from "@/providers/app-toaster";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <NextTopLoader
            color="#c6f24e"
            height={3}
            showSpinner={false}
            shadow={false}
          />
          {children}
          <AppToaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
