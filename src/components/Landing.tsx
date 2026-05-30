import { JungleBackground } from "./JungleBackground";
import styles from "./Landing.module.css";

interface LandingProps {
  /** When true, show the red Play button; otherwise show the Coming Soon badge. */
  enablePlay: boolean;
  /** Called when the player presses Play. */
  onPlay: () => void;
}

/**
 * The Punch Tamagotchi jungle landing page. Shows the hero, title, and tagline
 * over the shared jungle scene, with either a Coming Soon badge (prod) or a red
 * Play button (dev) as the CTA.
 */
export function Landing({ enablePlay, onPlay }: LandingProps) {
  return (
    <div className={styles.landing}>
      <JungleBackground />

      <main className={styles.card}>
        <img
          className={styles.hero}
          src="/punch-and-plushie.png"
          alt="Punch the monkey with his plush orangutan"
        />
        <h1 className={styles.title}>
          <span className={styles.mono} aria-hidden="true">
            🐒
          </span>
          <span className={styles.titleText}>Punch Tamagotchi</span>
          <span className={`${styles.mono} ${styles.flip}`} aria-hidden="true">
            🦧
          </span>
        </h1>
        <p className={styles.tagline}>
          Your pocket monkey who loves his plush orangutan. Feed him&nbsp;🍌, keep him happy, watch
          him grow.
        </p>

        {enablePlay ? (
          <button type="button" className={styles.play} onClick={onPlay} aria-label="Play">
            <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
        ) : (
          <span className={styles.badge}>🍌 Coming Soon 🍌</span>
        )}
      </main>
    </div>
  );
}
