"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { GoogleSignIn } from "@/features/auth/google-sign-in";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/auth-schemas";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { User } from "@/types";

const demoAccounts = [
  {
    role: "Host",
    email: "host@studiospace.com",
    password: "Studio123",
  },
  {
    role: "Creator",
    email: "creator@studiospace.com",
    password: "Studio123",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);

  const nextParam = searchParams.get("next");
  const next =
    nextParam?.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(next);
    }
  }, [isLoading, next, router, user]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const response = await api.post<{ user: User }>("/auth/login", values);
      setUser(response.data.user);
      toast.success(`Welcome back, ${response.data.user.name.split(" ")[0]}.`);
      router.replace(next);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Sign in failed. Please try again.";
      setFormError(message);
      toast.error("Could not sign in.", { description: message });
    }
  });

  function fillDemoAccount(email: string, password: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setFormError(null);
  }

  const registerHref = nextParam
    ? `/register?next=${encodeURIComponent(next)}`
    : "/register";

  return (
    <>
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Sign in and get back to it.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-base-content/55">
          Pick up your saved studios, manage listings, or check a booking
          request.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {formError ? (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
          >
            {formError}
          </div>
        ) : null}

        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
            {...register("email")}
          />
          {errors.email?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-base-content/70"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs font-semibold text-base-content/45 underline-offset-4 hover:text-base-content hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 pr-12 text-sm focus:border-base-content/30 focus:outline-none"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-base-content/40 hover:bg-base-200 hover:text-base-content"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-base-content/10" />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-base-content/35">
          or
        </span>
        <span className="h-px flex-1 bg-base-content/10" />
      </div>

      <GoogleSignIn next={next} />

      <p className="mt-6 text-center text-sm text-base-content/55">
        New to StudioSpace?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-base-content underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-base-content/15 bg-base-200/50 p-4">
        <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-base-content/40">
          <KeyRound className="size-3.5" aria-hidden="true" />
          Reviewer demo accounts
        </p>
        <div className="mt-3 space-y-2">
          {demoAccounts.map((account) => (
            <div
              key={account.email}
              className="flex items-center justify-between gap-3 rounded-xl bg-base-100 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-[0.7rem] font-semibold">{account.role}</p>
                <p className="truncate text-xs text-base-content/50">
                  {account.email} · {account.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  fillDemoAccount(account.email, account.password)
                }
                className="shrink-0 rounded-full border border-base-content/10 px-3 py-1.5 text-[0.68rem] font-semibold transition-colors hover:border-base-content/30 hover:bg-base-200"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Password reset"
        description="Password reset emails are not enabled in this demo build."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setForgotOpen(false)}
            >
              Close
            </Button>
            <a
              href="mailto:hello@studiospace.com?subject=StudioSpace%20password%20reset"
              className="btn btn-primary btn-sm rounded-full px-4 font-semibold"
            >
              Email support
            </a>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-base-content/60">
          Use one of the reviewer demo accounts below the form, or create a new
          account with the email you have access to. No password is ever
          displayed publicly.
        </p>
      </Modal>
    </>
  );
}
