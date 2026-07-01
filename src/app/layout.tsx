import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KireDuit",
  description: "Simple personal finance tracker for expenses and debts.",
  applicationName: "KireDuit",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", sizes: "1286x1286", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
      className={`${poppins.variable} h-full antialiased`}
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
