"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/types";

const SESSION_QUERY_KEY = ["auth", "session"] as const;

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await api.get<{ user: User }>("/auth/me");
        return response.data.user;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60_000,
  });

  const user = sessionQuery.data ?? null;

  const setUser = useCallback(
    (nextUser: User | null) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, nextUser);
    },
    [queryClient],
  );

  const refreshUser = useCallback(async () => {
    await sessionQuery.refetch();
  }, [sessionQuery]);

  const logout = useCallback(async () => {
    try {
      await api.post<null>("/auth/logout");
    } catch {
      // The local session is cleared even if the network request fails.
    } finally {
      setUser(null);
      toast.success("Signed out successfully.");
    }
  }, [setUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading: sessionQuery.isPending,
      isAuthenticated: Boolean(user),
      setUser,
      refreshUser,
      logout,
    }),
    [user, sessionQuery.isPending, setUser, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
