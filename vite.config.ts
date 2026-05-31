import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json";

// The `play` build (dev → punch.gigacorp.co) and the dev server ship the real
// game as an installable PWA. The default production build (prod →
// punchtamagotchi.com) shows only the Coming Soon landing, so it emits a
// self-destroying service worker that unregisters any previously-installed PWA
// and does no precaching — preventing a stale cached app from haunting prod.
export default defineConfig(({ mode }) => {
  const enablePlay = mode === "play" || mode === "development";

  return {
    // Inject the app version from package.json as a static build-time constant.
    // Vite performs a literal text substitution, so no runtime fetch occurs.
    // If `version` is absent the constant resolves to the literal `undefined`.
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version ?? undefined),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        selfDestroying: !enablePlay,
        includeAssets: ["favicon.svg", "apple-touch-icon.png"],
        manifest: {
          name: "Punch — Tamagotchi",
          short_name: "Punch",
          description: "Feed, play with, and rest Punch the monkey.",
          theme_color: "#f4c542",
          background_color: "#1a1a1a",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
  };
});
