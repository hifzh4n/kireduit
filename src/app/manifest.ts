import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KireDuit",
    short_name: "KireDuit",
    description: "Simple personal finance tracker for expenses and debts.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
