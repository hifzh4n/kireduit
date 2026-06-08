import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KireDuit",
  description: "Simple personal finance tracker for expenses and debts.",
  applicationName: "KireDuit",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/kireduit-logo.png", sizes: "1254x1254", type: "image/png" },
    ],
    apple: [{ url: "/kireduit-logo.png", sizes: "1254x1254", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "KireDuit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
