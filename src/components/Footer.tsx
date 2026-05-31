import styles from "./Footer.module.css";

/** Shared site footer: copyright + GigaCorp credit. */
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
    </footer>
  );
}
