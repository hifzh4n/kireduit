"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { AccentProvider } from "@/contexts/accent-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccentProvider>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
