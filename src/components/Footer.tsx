import styles from "./Footer.module.css";

/**
 * Renders the app version in the footer using the build-time global
 * `__APP_VERSION__` injected by Vite. When the version is missing, undefined,
 * null, or empty, no version text is rendered (graceful degradation).
 */
export function Footer() {
  const version = __APP_VERSION__;

  return (
    <footer className={styles.footer} data-testid="footer">
      {version ? <span data-testid="footer-version">v{version}</span> : null}
    </footer>
  );
}
