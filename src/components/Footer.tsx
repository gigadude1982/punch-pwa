import styles from "./Footer.module.css";

function Footer() {
  const version =
    typeof __APP_VERSION__ === "string" && __APP_VERSION__.length > 0 ? __APP_VERSION__ : null;

  return (
    <footer className={styles.footer}>
      {version ? (
        <span className={styles.version} data-testid="footer-version">
          v{version}
        </span>
      ) : null}
    </footer>
  );
}

export { Footer };
