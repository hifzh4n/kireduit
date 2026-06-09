"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { AccentProvider } from "@/contexts/accent-context";
import { ThemeProvider } from "@/contexts/theme-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AccentProvider>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
