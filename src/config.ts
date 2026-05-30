/**
 * Build-time feature flags, read from Vite env. Isolated here so that only the
 * app entry point (main.tsx) touches `import.meta` — keeping it out of any file
 * compiled by Jest (whose CommonJS config disallows `import.meta`).
 *
 * Enabled for the `play` build (dev → punch.gigacorp.co) and the dev server;
 * disabled for the default production build (prod → punchtamagotchi.com), which
 * shows the Coming Soon landing only.
 */
export const ENABLE_PLAY = import.meta.env.VITE_ENABLE_PLAY === "true";
