import styles from "./Landing.module.css";

interface LandingProps {
  /** When true, show the red Play button; otherwise show the Coming Soon badge. */
  enablePlay: boolean;
  /** Called when the player presses Play. */
  onPlay: () => void;
}

/** Decorative vines hanging from the canopy: [leftPct, heightPx, delaySec]. */
const VINES: ReadonlyArray<[number, number, number]> = [
  [8, 150, 0],
  [19, 95, 1.2],
  [31, 180, 0.5],
  [44, 110, 2],
  [57, 160, 0.8],
  [69, 90, 1.6],
  [81, 200, 0.3],
  [92, 120, 2.4],
];

/** Drifting background bananas: [leftPct, fontRem, durationSec, delaySec]. */
const BANANAS: ReadonlyArray<[number, number, number, number]> = [
  [3, 3.2, 9, 0],
  [10, 2.6, 12, 3],
  [17, 4.2, 8, 1.5],
  [24, 2.9, 11, 5],
  [31, 3.6, 10, 2],
  [38, 2.5, 13, 6],
  [45, 4.5, 9.5, 0.5],
  [52, 3, 12, 4],
  [59, 3.8, 8.5, 2.5],
  [66, 2.7, 13, 1],
  [73, 4, 10.5, 5.5],
  [80, 3.3, 9, 7],
  [87, 4.4, 11.5, 3.5],
  [94, 2.8, 12.5, 1.8],
  [20, 3.5, 14, 8],
  [70, 3.1, 15, 6.5],
];

const FOLIAGE = ["🌿", "🍃", "🌿", "🍃", "🌿", "🍃", "🌿", "🍃", "🌿", "🍃", "🌿"];

const SKYLINE: ReadonlyArray<[string, string]> = [
  [styles.t2, "🌴"],
  [styles.t1, "🌴"],
  [styles.t3, "🌴"],
  [styles.t2, "🌳"],
  [styles.t1, "🌴"],
  [styles.t3, "🌴"],
  [styles.t2, "🌴"],
];

/**
 * The Punch Tamagotchi jungle landing page. Shows the hero, title, and tagline,
 * with either a Coming Soon badge (prod) or a red Play button (dev) as the CTA.
 */
export function Landing({ enablePlay, onPlay }: LandingProps) {
  return (
    <div className={styles.landing}>
      <div className={styles.bgTrees} aria-hidden="true">
        <span style={{ left: "2%" }}>🌴</span>
        <span style={{ right: "3%" }}>🌳</span>
      </div>

      <div className={styles.headerShade} aria-hidden="true" />

      <div className={styles.canopy} aria-hidden="true">
        <div className={styles.foliage}>
          {FOLIAGE.map((leaf, i) => (
            <span key={i}>{leaf}</span>
          ))}
        </div>
        {VINES.map(([left, height, delay], i) => (
          <span
            key={i}
            className={styles.vine}
            style={{ left: `${left}%`, height: `${height}px`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div className={styles.bananas} aria-hidden="true">
        {BANANAS.map(([left, font, duration, delay], i) => (
          <span
            key={i}
            style={{
              left: `${left}%`,
              fontSize: `${font}rem`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            🍌
          </span>
        ))}
      </div>

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
            🐒
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

      <div className={styles.jungleFloor} aria-hidden="true">
        <div className={styles.skyline}>
          {SKYLINE.map(([cls, tree], i) => (
            <span key={i} className={cls}>
              {tree}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
