"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, Input, Label } from "@/components/ui/form";

export default function Page() {
  const { profile, user, updateDisplayName } = useAuth();
  const displayName = profile?.displayName || user?.displayName || "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "KD";
  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: { displayName },
  });

  async function submit(values: { displayName: string }) {
    await updateDisplayName(values.displayName);
    toast.success("Profile updated");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--accent-ink)]">
            {initials}
          </div>
          <div>
            <CardTitle>Profile</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-300">Only your display name can be changed.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" {...form.register("displayName")} />
            <FieldError message={form.formState.errors.displayName?.message?.toString()} />
          </Field>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || user?.email || ""}
              disabled
              className="cursor-not-allowed bg-sky-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            />
          </Field>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
