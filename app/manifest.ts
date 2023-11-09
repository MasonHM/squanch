import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Squanch Bros",
    short_name: "Squanch",
    start_url: "/",
    display: "standalone",
    background_color: "magenta",
    theme_color: "magenta",
    orientation: "portrait-primary",
    icons: [
      {
        src: "apple-icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
