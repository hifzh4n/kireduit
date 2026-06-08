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
        src: "/kireduit-logo.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
