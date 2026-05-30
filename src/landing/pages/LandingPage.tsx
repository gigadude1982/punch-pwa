import { PlayButton } from "../components/PlayButton";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <main className={styles.landingPage}>
      <h1 className={styles.title}>Punch</h1>
      <p className={styles.subtitle}>Get ready to play.</p>
      <PlayButton />
    </main>
  );
}
