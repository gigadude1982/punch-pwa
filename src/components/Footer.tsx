import styles from "./Footer.module.css";

/**
 * App version baked into the bundle at build time via Vite's `define`.
 * Falls back to `undefined` in non-Vite contexts (e.g. Jest) so the footer
 * degrades gracefully when the constant is not defined.
 */
const appVersion: string | undefined =
  typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : undefined;

/** Shared site footer: copyright + GigaCorp credit + build version. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Punch Tamagotchi</span>
      <span>
        A{" "}
        <a href="https://www.gigacorp.co" target="_blank" rel="noopener noreferrer">
          GigaCorp
        </a>{" "}
        production
      </span>
      {appVersion ? (
        <span className={styles.version} data-testid="footer-version">
          v{appVersion}
        </span>
      ) : null}
    </footer>
  );
}
