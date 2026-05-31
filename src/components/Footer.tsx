import styles from "./Footer.module.css";

/**
 * `__APP_VERSION__` is injected at build time by Vite's `define` config from
 * package.json's `version` field. It may be undefined in environments (e.g.
 * Jest) where the define is not applied, so it is read defensively.
 */
declare const __APP_VERSION__: string | undefined;

/** Shared site footer: copyright + GigaCorp credit + build-time app version. */
export function Footer() {
  const version =
    typeof __APP_VERSION__ === "string" && __APP_VERSION__.length > 0 ? __APP_VERSION__ : undefined;

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
