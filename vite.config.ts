import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Read the version from package.json at config-evaluation time (runs in Node
// during build only — never at app runtime). It is injected below via `define`
// as the compile-time global constant `__APP_VERSION__`, baked into the bundle
// as a string literal with no runtime fetching or JSON parsing.
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8"),
) as { version?: string };
const appVersion = pkg.version ?? "";

// The `play` build (dev → punch.gigacorp.co) and the dev server ship the real
// game as an installable PWA. The default production build (prod →
// punchtamagotchi.com) shows only the Coming Soon landing, so it emits a
// self-destroying service worker that unregisters any previously-installed PWA
// and does no precaching — preventing a stale cached app from haunting prod.
export default defineConfig(({ mode }) => {
  const enablePlay = mode === "play" || mode === "development";

  return {
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
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
