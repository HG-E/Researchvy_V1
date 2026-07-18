import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Researchvy",
    short_name:       "Researchvy",
    description:      "Scholarly visibility and research intelligence platform",
    start_url:        "/",
    display:          "standalone",
    background_color: "#ffffff",
    theme_color:      "#ffffff",
    orientation:      "portrait",
    icons: [
      { src: "/icon.png",       sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    categories: ["education", "productivity", "business"],
  };
}
