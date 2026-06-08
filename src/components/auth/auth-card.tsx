"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "firebase/auth";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { authSchema, forgotSchema, registerSchema, resetSchema } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Input, Label, PasswordInput } from "@/components/ui/form";

type Mode = "login" | "register" | "forgot" | "reset";

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, forgotPassword } = useAuth();
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const schema = isRegister ? registerSchema : isForgot ? forgotSchema : isReset ? resetSchema : authSchema;
  type AuthValues = {
    displayName: string;
    email: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
  };

  const form = useForm<AuthValues>({
    resolver: zodResolver(schema) as unknown as Resolver<AuthValues>,
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function submit(values: Record<string, string>) {
    try {
      if (!isFirebaseConfigured) {
        toast.error("Firebase is not configured yet. Add your NEXT_PUBLIC_FIREBASE_* values.");
        return;
      }
      if (isLogin) {
        await login(values.email, values.password);
        toast.success("Login successful");
        router.replace("/dashboard");
      } else if (isRegister) {
        await register(values.displayName, values.email, values.password);
        toast.success("Registration successful");
        router.replace("/dashboard");
      } else if (isForgot) {
        await forgotPassword(values.email);
        toast.success("Password reset email sent");
        router.push("/login");
      } else {
        const oobCode = searchParams.get("oobCode");
        if (!oobCode) {
          toast.error("Reset link is missing or invalid.");
          return;
        }
        await confirmPasswordReset(auth, oobCode, values.newPassword);
        toast.success("Password reset successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    }
  }

  const title = isLogin ? "Welcome back" : isRegister ? "Create account" : isForgot ? "Reset your password" : "Set new password";
  const description = isLogin
    ? "Log in to manage your expenses and debts."
    : isRegister
      ? "Start tracking your money in a few seconds."
      : isForgot
        ? "We will send a reset link to your email."
        : "Enter your new password from the reset link.";

  return (
    <main className="min-h-screen bg-[#fdf7ff] px-4 py-6 dark:bg-[#101423] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-5xl flex-col justify-center gap-5 md:grid md:grid-cols-[0.9fr_1fr] md:items-center md:gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- Keep the logo as the original PNG without optimization. */}
            <img
              src="/kireduit-logo.png"
              alt="KireDuit logo"
              className="h-16 w-16 shrink-0 object-contain"
            />
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">KireDuit</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Simple money tracking</p>
            </div>
          </div>
          <div className="hidden max-w-sm space-y-2 md:block">
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Track money without clutter.</h1>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Keep expenses, money you owe, and money owed to you in one clean personal dashboard.
            </p>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
              {isRegister ? (
                <Field>
                  <Label htmlFor="displayName">Display name</Label>
                  <Input id="displayName" autoComplete="name" placeholder="Enter your display name" {...form.register("displayName")} />
                  <FieldError message={form.formState.errors.displayName?.message?.toString()} />
                </Field>
              ) : null}

              {!isReset ? (
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" autoComplete="email" placeholder="Enter your email" {...form.register("email")} />
                  <FieldError message={form.formState.errors.email?.message?.toString()} />
                </Field>
              ) : null}

              {!isForgot && !isReset ? (
                <Field>
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    {...form.register("password")}
                  />
                  <FieldError message={form.formState.errors.password?.message?.toString()} />
                  {isLogin ? (
                    <Link className="self-end text-sm font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/forgot-password">
                      Forgot password?
                    </Link>
                  ) : null}
                </Field>
              ) : null}

              {isReset ? (
                <>
                  <Field>
                    <Label htmlFor="newPassword">New password</Label>
                    <PasswordInput id="newPassword" autoComplete="new-password" placeholder="Enter new password" {...form.register("newPassword")} />
                    <FieldError message={form.formState.errors.newPassword?.message?.toString()} />
                  </Field>
                  <Field>
                    <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                    <PasswordInput id="confirmNewPassword" autoComplete="new-password" placeholder="Confirm new password" {...form.register("confirmNewPassword")} />
                    <FieldError message={form.formState.errors.confirmNewPassword?.message?.toString()} />
                  </Field>
                </>
              ) : null}

              <Button className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Please wait..." : isLogin ? "Login" : isRegister ? "Register" : isForgot ? "Send reset link" : "Reset password"}
              </Button>
            </form>

            <div className="mt-4 space-y-2 text-center text-sm text-slate-500 dark:text-slate-300">
              {isLogin ? (
                <p>
                  No account?{" "}
                  <Link className="font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/register">
                    Register
                  </Link>
                </p>
              ) : (
                <Link className="font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/login">
                  Back to login
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
