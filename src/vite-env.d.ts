/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** "true" enables the Play button + game (dev builds); unset → Coming Soon (prod). */
  readonly VITE_ENABLE_PLAY?: string;
}

/**
 * App version injected at build time from package.json via Vite's `define`.
 * Replaced literally at build time — no runtime fetch. May be an empty string
 * if the version field is absent.
 */
declare const __APP_VERSION__: string;

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
