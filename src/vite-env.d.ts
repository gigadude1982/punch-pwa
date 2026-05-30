/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** "true" enables the Play button + game (dev builds); unset → Coming Soon (prod). */
  readonly VITE_ENABLE_PLAY?: string;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/** App version injected at build time from package.json via Vite's `define`. */
declare const __APP_VERSION__: string;
