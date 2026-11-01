"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoogleSignIn } from "@/features/auth/google-sign-in";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/auth-schemas";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { User } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nextParam = searchParams.get("next");
  const next =
    nextParam?.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  const passwordRules = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
  ];

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await api.post<{ user: User }>("/auth/register", {
        name: values.name,
        email: values.email,
        photoURL: values.photoURL?.trim() || undefined,
        password: values.password,
      });

      const login = await api.post<{ user: User }>("/auth/login", {
        email: values.email,
        password: values.password,
      });

      setUser(login.data.user);
      toast.success("Your account is ready.", {
        description: "Welcome to StudioSpace.",
      });
      router.replace(next);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Account creation failed. Please try again.";
      setFormError(message);
      toast.error("Could not create your account.", { description: message });
    }
  });

  const loginHref = nextParam
    ? `/login?next=${encodeURIComponent(next)}`
    : "/login";

  return (
    <>
      <div>
        <p className="eyebrow">Join StudioSpace</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Make room for your next idea.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-base-content/55">
          Book studios you love, save the ones you want to try, and list your
          own space when you are ready.
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
            htmlFor="register-name"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
            {...register("name")}
          />
          {errors.name?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Email address
          </label>
          <input
            id="register-email"
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
          <label
            htmlFor="register-photo"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Photo URL{" "}
            <span className="font-normal text-base-content/40">(optional)</span>
          </label>
          <input
            id="register-photo"
            type="url"
            autoComplete="photo"
            placeholder="https://…"
            className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
            {...register("photoURL")}
          />
          <p className="mt-1.5 text-[0.68rem] text-base-content/40">
            Add a portrait so hosts recognize you. You can leave this blank.
          </p>
          {errors.photoURL?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.photoURL.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
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
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {passwordRules.map((rule) => (
              <li
                key={rule.label}
                className={cn(
                  "flex items-center gap-1.5 text-[0.68rem] font-medium",
                  rule.met ? "text-success" : "text-base-content/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full",
                    rule.met ? "bg-success/15" : "bg-base-200",
                  )}
                >
                  <Check className="size-2.5" aria-hidden="true" />
                </span>
                {rule.label}
              </li>
            ))}
          </ul>
          {errors.password?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="register-confirm"
            className="mb-1.5 block text-xs font-semibold text-base-content/70"
          >
            Confirm password
          </label>
          <input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message ? (
            <p className="mt-1.5 text-xs font-medium text-error">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Create account
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
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-base-content underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
