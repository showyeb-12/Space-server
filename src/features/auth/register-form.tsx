"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
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
import type { User } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nextParam = searchParams.get("next");
  const next =
    nextParam?.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/";

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
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  const passwordRules = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
  ];

  const onValid = async (values: RegisterFormValues) => {
    setFormError(null);

    // Live password check
    if (!passwordRules.every((rule) => rule.met)) {
      const err =
        "Password must be at least 6 characters with at least one uppercase and one lowercase letter.";
      setFormError(err);
      toast.error(err);
      return;
    }

    try {
      const photo = values.photoURL?.trim();
      const validPhoto = photo && /^https?:\/\//i.test(photo) ? photo : undefined;

      await api.post<{ user: User }>("/auth/register", {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        photoURL: validPhoto,
        password: values.password,
      });

      toast.success("Account created successfully!", {
        description: "Please sign in with your email and password.",
      });

      router.push(
        `/login?email=${encodeURIComponent(
          values.email.trim().toLowerCase(),
        )}&registered=true&next=${encodeURIComponent(next)}`,
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Account creation failed. Please try again.";
      setFormError(message);
      toast.error("Could not create your account.", { description: message });
    }
  };

  const onInvalid = (fieldErrors: FieldErrors<RegisterFormValues>) => {
    const firstField = Object.keys(fieldErrors)[0] as
      | keyof RegisterFormValues
      | undefined;
    const msg = firstField
      ? fieldErrors[firstField]?.message
      : "Please fill out the form fields correctly.";
    setFormError(String(msg));
    toast.error("Form error", { description: String(msg) });
  };

  const loginHref = nextParam
    ? `/login?next=${encodeURIComponent(next)}`
    : "/login";

  return (
    <>
      <div>
        <p className="eyebrow">Sign Up / Register</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Create an account.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-base-content/55">
          Join StudioSpace to discover creative workspaces, book studios, and share your own rooms.
        </p>
      </div>

      <form onSubmit={handleSubmit(onValid, onInvalid)} className="mt-8 space-y-4" noValidate>
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
            Full Name <span className="text-error">*</span>
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Maya Chen"
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
            Email Address <span className="text-error">*</span>
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="maya@example.com"
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
            Photo URL <span className="font-normal text-base-content/40">(optional)</span>
          </label>
          <input
            id="register-photo"
            type="url"
            autoComplete="photo"
            placeholder="https://images.unsplash.com/..."
            className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
            {...register("photoURL")}
          />
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
            Password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Sign Up / Register
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
          Log in here
        </Link>
      </p>
    </>
  );
}
