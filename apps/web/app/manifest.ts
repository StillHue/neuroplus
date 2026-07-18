import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neuroplus",
    short_name: "Neuroplus",
    description: "Acompanhamento do diagnóstico e cuidado neurodivergente",
    start_url: "/inicio",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1c1e26",
    theme_color: "#6fb7b0",
    categories: ["health", "medical"],
    lang: "pt-BR",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
