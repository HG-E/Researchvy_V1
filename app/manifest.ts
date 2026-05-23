import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Researchvy",
    short_name:       "Researchvy",
    description:      "Scholarly visibility and research intelligence platform",
    start_url:        "/",
    display:          "standalone",
    background_color: "#080E1A",
    theme_color:      "#0A0F1A",
    orientation:      "portrait",
    icons: [
      { src: "/icon.png",       sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    categories: ["education", "productivity", "business"],
  };
}
