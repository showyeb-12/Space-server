"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { User } from "@/types";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const isGoogleInitialized = React.useRef<boolean>(false);

export function GoogleSignIn({ next }: { next: string }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleCredential = useCallback(
    async (response: { credential: string }) => {
      setIsSigningIn(true);

      try {
        const result = await api.post<{ user: User }>("/auth/google", {
          credential: response.credential,
        });

        setUser(result.data.user);
        toast.success("Signed in with Google.");
        router.push(next);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Google sign-in failed. Please try again.";
        toast.error("Could not sign in with Google.", {
          description: message,
        });
      } finally {
        setIsSigningIn(false);
      }
    },
    [next, router, setUser],
  );

  useEffect(() => {
    if (!googleClientId || !isScriptReady || !buttonRef.current || googleInitialized.current) return;

    const google = window.google;
    if (!google) return;

    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    googleInitialized.current = true;

    buttonRef.current.innerHTML = "";
    google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: 340,
    });

    return () => {
      google.accounts.id.cancel?.();
    };
  }, [handleCredential, isScriptReady]);

  if (!googleClientId) {
    return (
      <div>
        <button
          type="button"
          onClick={() =>
            toast.error("Google sign-in is not configured yet.", {
              description:
                "Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to the client environment to enable it.",
            })
          }
          className="btn h-12 w-full rounded-full border border-base-content/15 bg-base-100 font-semibold hover:bg-base-200"
        >
          Continue with Google
        </button>
        <p className="mt-2 text-center text-[0.68rem] text-base-content/40">
          Google sign-in is not configured in this environment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
        onError={() => {
          setScriptFailed(true);
          toast.error("Google sign-in could not load.", {
            description: "Check your connection and refresh the page.",
          });
        }}
      />

      <div className="flex justify-center">
        <div ref={buttonRef} className="min-h-11" />
      </div>

      {isSigningIn ? (
        <p className="mt-2 flex items-center justify-center gap-2 text-center text-xs font-medium text-base-content/50">
          <span className="loading loading-spinner loading-xs" />
          Signing in with Google…
        </p>
      ) : null}

      {scriptFailed ? (
        <p className="mt-2 text-center text-xs font-medium text-error">
          Google sign-in could not load. Use email and password instead.
        </p>
      ) : null}
    </div>
  );
}
