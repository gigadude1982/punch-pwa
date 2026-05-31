import styles from "./Footer.module.css";

/**
 * Build-time version constant injected by Vite's `define` config.
 * Resolves to the bare identifier `__APP_VERSION__` (replaced literally at
 * build time) or the global property in test environments. `typeof` guards
 * against the undeclared/undefined case so the footer degrades gracefully.
 */
const version: string | undefined =
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
      {version ? <span data-testid="footer-version">v{version}</span> : null}
    </footer>
  );
}
