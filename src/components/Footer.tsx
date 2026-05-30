import styles from "./Footer.module.css";

/**
 * Renders the app version (e.g. "v1.2.3") injected at build time via Vite's
 * `define` option. Gracefully renders nothing when the version is missing,
 * undefined, null, or an empty string. No runtime fetching occurs — the value
 * is a static compile-time replacement.
 */
export function Footer() {
  const version = typeof __APP_VERSION__ === "string" ? __APP_VERSION__.trim() : "";

  return (
    <footer className={styles.footer} data-testid="footer">
      {version ? <span data-testid="footer-version">v{version}</span> : null}
    </footer>
  );
}
