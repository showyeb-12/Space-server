"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { THEME_STORAGE_KEY } from "@/lib/constants";

export type Theme = "studiolight" | "studiodark";

const listeners = new Set<() => void>();
let cachedTheme: Theme | null = null;

function getStoredTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "studiolight" || stored === "studiodark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "studiodark"
    : "studiolight";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "studiolight";
  }

  cachedTheme ??= getStoredTheme();
  return cachedTheme;
}

function getServerSnapshot(): Theme {
  return "studiolight";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function updateTheme(nextTheme: Theme) {
  cachedTheme = nextTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  document.documentElement.setAttribute("data-theme", nextTheme);
  listeners.forEach((listener) => listener());
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    updateTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    updateTheme(
      getThemeSnapshot() === "studiodark" ? "studiolight" : "studiodark",
    );
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
