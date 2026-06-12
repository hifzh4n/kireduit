"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { passwordSchema } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Label, PasswordInput } from "@/components/ui/form";

export default function Page() {
  const t = useTranslations("Settings");
  const tAuth = useTranslations("Auth");
  const { changePassword } = useAuth();
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  async function submit(values: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      form.reset();
      toast.success(t("passwordChanged"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("unableChangePassword"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("security")}</CardTitle>
        <CardDescription>{t("securityInstructions")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
            <PasswordInput id="currentPassword" autoComplete="current-password" placeholder={tAuth("passwordPlaceholder")} {...form.register("currentPassword")} />
            <FieldError message={form.formState.errors.currentPassword?.message?.toString()} />
          </Field>
          <Field>
            <Label htmlFor="newPassword">{tAuth("newPassword")}</Label>
            <PasswordInput id="newPassword" autoComplete="new-password" placeholder={tAuth("newPasswordPlaceholder")} {...form.register("newPassword")} />
            <FieldError message={form.formState.errors.newPassword?.message?.toString()} />
          </Field>
          <Field>
            <Label htmlFor="confirmNewPassword">{tAuth("confirmNewPassword")}</Label>
            <PasswordInput id="confirmNewPassword" autoComplete="new-password" placeholder={tAuth("confirmNewPasswordPlaceholder")} {...form.register("confirmNewPassword")} />
            <FieldError message={form.formState.errors.confirmNewPassword?.message?.toString()} />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting} loading={form.formState.isSubmitting}>
            {t("changePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
