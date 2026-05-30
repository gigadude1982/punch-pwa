import styles from "./Footer.module.css";

/**
 * Renders the app version (injected at build time via Vite's `define`).
 * Gracefully omits the version text when `__APP_VERSION__` is undefined,
 * null, or an empty string.
 */
export function Footer() {
  const version = __APP_VERSION__;

  return (
    <footer className={styles.footer} data-testid="footer">
      {version ? <span data-testid="footer-version">v{version}</span> : null}
    </footer>
  );
}
