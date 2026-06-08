import { z } from "zod";
import { expenseCategories } from "./types";

function notFutureDate(value?: string) {
  if (!value) return true;
  return value <= new Date().toISOString().slice(0, 10);
}

export const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = authSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
});

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmNewPassword: z.string().min(1, "Confirm your new password."),
}).refine((values) => values.newPassword === values.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be more than 0."),
  category: z.enum(expenseCategories),
  date: z.string().min(1, "Choose a date.").refine(notFutureDate, "Future dates are not allowed."),
  description: z.string().max(160, "Keep it below 160 characters.").optional(),
});

export const debtSchema = z.object({
  personName: z.string().min(2, "Enter the person's name."),
  amount: z.coerce.number().positive("Amount must be more than 0."),
  type: z.enum(["i-owe", "owe-me"]),
  status: z.enum(["paid", "unpaid"]),
  dueDate: z.string().optional().refine(notFutureDate, "Future dates are not allowed."),
  description: z.string().max(180, "Keep it below 180 characters.").optional(),
});

export const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmNewPassword: z.string().min(1, "Confirm your new password."),
}).refine((values) => values.newPassword === values.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],
});
