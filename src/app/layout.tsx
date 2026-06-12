import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import "./globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body className="relative min-h-full overflow-x-hidden bg-[#fdf7ff] text-slate-800 dark:bg-[#101423] dark:text-slate-100">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "fixed inset-0 z-0 h-screen w-screen fill-slate-900/[0.06] dark:fill-white/[0.06]",
            "[mask-image:linear-gradient(to_bottom_right,white,white,transparent)]",
          )}
        />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
