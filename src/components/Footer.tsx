import styles from "./Footer.module.css";

/** Build-time injected app version (from package.json via Vite `define`). */
declare const __APP_VERSION__: string | undefined;

/** Shared site footer: copyright + GigaCorp credit + build version. */
export function Footer() {
  const version = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : undefined;

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
      {version ? (
        <span className={styles.version} data-testid="footer-version">
          v{version}
        </span>
      ) : null}
    </footer>
  );
}
