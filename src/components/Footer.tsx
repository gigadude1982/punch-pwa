import styles from "./Footer.module.css";

/**
 * The app version, injected at build time by Vite's `define` config from
 * package.json. Guarded with `typeof` so it is safe to read in environments
 * (e.g. Jest) where the constant may not be defined.
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
