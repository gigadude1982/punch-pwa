/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** "true" enables the Play button + game (dev builds); unset → Coming Soon (prod). */
  readonly VITE_ENABLE_PLAY?: string;
}

/**
 * App version injected at build time via Vite's `define` config from
 * package.json. Resolves to the literal version string (e.g. "1.2.3") or the
 * `undefined` literal when the version field is absent. Always guard reads with
 * `typeof __APP_VERSION__ === "string"` for graceful degradation.
 */
declare const __APP_VERSION__: string | undefined;

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
