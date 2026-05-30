import { PlayButton } from "../components/PlayButton";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <main className={styles.landingPage}>
      <h1 className={styles.title}>Word Game</h1>
      <PlayButton />
    </main>
  );
}
