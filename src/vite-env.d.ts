/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare const __APP_VERSION__: string;
