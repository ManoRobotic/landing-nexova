import { defineConfig, fontProviders } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://yoursite.com",
  output: "server", // Enable server-side rendering for dynamic features
  adapter: vercel({ runtime: 'nodejs20.x' }), // Use Vercel serverless adapter with Node.js 20 runtime
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
