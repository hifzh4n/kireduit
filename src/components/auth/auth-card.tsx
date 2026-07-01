"use client";

import { useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "firebase/auth";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { authSchema, forgotSchema, registerSchema, resetSchema } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Input, Label, PasswordInput } from "@/components/ui/form";
import { Link, useRouter } from "@/i18n/navigation";

type Mode = "login" | "register" | "forgot" | "reset";

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, forgotPassword } = useAuth();
  const t = useTranslations("Auth");
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
        toast.success(t("loginSuccess"));
        router.replace("/dashboard");
      } else if (isRegister) {
        await register(values.displayName, values.email, values.password);
        toast.success(t("registerSuccess"));
        router.replace("/dashboard");
      } else if (isForgot) {
        await forgotPassword(values.email);
        toast.success(t("resetEmailSent"));
        router.push("/login");
      } else {
        const oobCode = searchParams.get("oobCode");
        if (!oobCode) {
          toast.error(t("missingResetLink"));
          return;
        }
        await confirmPasswordReset(auth, oobCode, values.newPassword);
        toast.success(t("resetSuccess"));
        router.push("/login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("authFailed"));
    }
  }

  const title = isLogin ? t("welcomeBack") : isRegister ? t("createAccount") : isForgot ? t("resetPassword") : t("setNewPassword");
  const description = isLogin
    ? t("loginDescription")
    : isRegister
      ? t("registerDescription")
      : isForgot
        ? t("forgotDescription")
        : t("resetDescription");

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-5xl flex-col justify-center gap-5 md:grid md:grid-cols-[0.9fr_1fr] md:items-center md:gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-white shadow-[0_18px_36px_rgb(15_23_42_/_0.14),0_6px_14px_rgb(16_185_129_/_0.10),inset_0_1px_0_rgb(255_255_255_/_0.7)] dark:bg-slate-950 dark:shadow-[0_18px_36px_rgb(0_0_0_/_0.32),0_6px_14px_rgb(16_185_129_/_0.12),inset_0_1px_0_rgb(255_255_255_/_0.1)]">
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255_/_0.9),transparent_42%,rgb(16_185_129_/_0.16))]" />
              {/* eslint-disable-next-line @next/next/no-img-element -- Keep the logo as the original PNG without optimization. */}
              <img
                src="/logo.png"
                alt="KireDuit logo"
                className="relative h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">KireDuit</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t("tagline")}</p>
            </div>
          </div>
          <div className="hidden max-w-sm space-y-2 md:block">
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">{t("heroTitle")}</h1>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t("heroDescription")}
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
                  <Label htmlFor="displayName">{t("displayName")}</Label>
                  <Input id="displayName" autoComplete="name" placeholder={t("displayNamePlaceholder")} {...form.register("displayName")} />
                  <FieldError message={form.formState.errors.displayName?.message?.toString()} />
                </Field>
              ) : null}

              {!isReset ? (
                <Field>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} {...form.register("email")} />
                  <FieldError message={form.formState.errors.email?.message?.toString()} />
                </Field>
              ) : null}

              {!isForgot && !isReset ? (
                <Field>
                  <Label htmlFor="password">{t("password")}</Label>
                  <PasswordInput
                    id="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? t("passwordPlaceholder") : t("createPasswordPlaceholder")}
                    {...form.register("password")}
                  />
                  <FieldError message={form.formState.errors.password?.message?.toString()} />
                  {isLogin ? (
                    <Link className="self-end text-sm font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/forgot-password">
                      {t("forgotPassword")}
                    </Link>
                  ) : null}
                </Field>
              ) : null}

              {isReset ? (
                <>
                  <Field>
                    <Label htmlFor="newPassword">{t("newPassword")}</Label>
                    <PasswordInput id="newPassword" autoComplete="new-password" placeholder={t("newPasswordPlaceholder")} {...form.register("newPassword")} />
                    <FieldError message={form.formState.errors.newPassword?.message?.toString()} />
                  </Field>
                  <Field>
                    <Label htmlFor="confirmNewPassword">{t("confirmNewPassword")}</Label>
                    <PasswordInput id="confirmNewPassword" autoComplete="new-password" placeholder={t("confirmNewPasswordPlaceholder")} {...form.register("confirmNewPassword")} />
                    <FieldError message={form.formState.errors.confirmNewPassword?.message?.toString()} />
                  </Field>
                </>
              ) : null}

              <Button className="w-full" disabled={form.formState.isSubmitting} loading={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("pleaseWait") : isLogin ? t("login") : isRegister ? t("register") : isForgot ? t("resetPassword") : t("resetPassword")}
              </Button>
            </form>

            <div className="mt-4 space-y-2 text-center text-sm text-slate-500 dark:text-slate-300">
              {isLogin ? (
                <p>
                  {t("noAccount")}{" "}
                  <Link className="font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/register">
                    {t("register")}
                  </Link>
                </p>
              ) : (
                <Link className="font-medium text-[var(--accent-text)] dark:text-[var(--accent)]" href="/login">
                  {t("backToLogin")}
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
