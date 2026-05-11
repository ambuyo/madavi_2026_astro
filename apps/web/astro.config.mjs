import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: "https://madavi.ai",
  integrations: [react(), sitemap()],
  image: {
    // Authorize WordPress domain for remote image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.madavi.co",
        pathname: "/wp-content/**",
      },
    ],
    // Optimize image formats and caching
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
