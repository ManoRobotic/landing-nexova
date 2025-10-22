import { defineConfig, fontProviders } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://yoursite.com",
  output: "server", // Enable server-side rendering
  adapter: node({ mode: 'standalone' }), // Use adapter property instead of integrations
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-sans",
        weights: [400, 500],
      }
    ],
  },
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
