"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { passwordSchema } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Label, PasswordInput } from "@/components/ui/form";

export default function Page() {
  const { changePassword } = useAuth();
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  async function submit(values: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      form.reset();
      toast.success("Password changed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change password");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Confirm your current password before setting a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="currentPassword">Current password</Label>
            <PasswordInput id="currentPassword" autoComplete="current-password" {...form.register("currentPassword")} />
            <FieldError message={form.formState.errors.currentPassword?.message?.toString()} />
          </Field>
          <Field>
            <Label htmlFor="newPassword">New password</Label>
            <PasswordInput id="newPassword" autoComplete="new-password" {...form.register("newPassword")} />
            <FieldError message={form.formState.errors.newPassword?.message?.toString()} />
          </Field>
          <Field>
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <PasswordInput id="confirmNewPassword" autoComplete="new-password" {...form.register("confirmNewPassword")} />
            <FieldError message={form.formState.errors.confirmNewPassword?.message?.toString()} />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
