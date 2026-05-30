import styles from "./Footer.module.css";

export function Footer() {
  const version = __APP_VERSION__;

  return (
    <footer className={styles.footer} data-testid="footer">
      {version ? (
        <span className={styles.version} data-testid="footer-version">
          v{version}
        </span>
      ) : null}
    </footer>
  );
}
