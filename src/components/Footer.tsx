import styles from "./Footer.module.css";

/**
 * Renders the app version, injected at build time via Vite's `define` option as
 * the global constant `__APP_VERSION__`. If the version is undefined, null, or
 * empty, no version text is rendered (graceful degradation). This is a static
 * build-time replacement — no network requests are made.
 */
export function Footer() {
  const version = typeof __APP_VERSION__ === "string" ? __APP_VERSION__.trim() : "";

  return (
    <footer className={styles.footer} data-testid="footer">
      {version ? <span data-testid="footer-version">v{version}</span> : null}
    </footer>
  );
}
