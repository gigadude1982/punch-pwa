import { motion, useReducedMotion } from "framer-motion";
import styles from "./JungleBackground.module.css";

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

/** Drifting bananas: [leftPct, fontRem, durationSec, delaySec]. */
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
 * A flowing jungle river that sits low on the scene, beneath Punch's rock.
 * The wave bands gently translate to convey moving water; the motion is
 * disabled when the user prefers reduced motion. Rendered with a lower
 * z-index than the rock so it always reads as being behind it.
 */
function River() {
  const reduce = useReducedMotion();
  const flow = reduce
    ? {}
    : {
        animate: { x: ["0%", "-50%"] },
        transition: { duration: 14, ease: "linear", repeat: Infinity },
      };
  const flowSlow = reduce
    ? {}
    : {
        animate: { x: ["-50%", "0%"] },
        transition: { duration: 20, ease: "linear", repeat: Infinity },
      };

  return (
    <div className={styles.river} data-testid="jungle-river">
      <svg
        className={styles.riverSvg}
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="100" height="24" fill="var(--river-deep)" />
        <motion.g {...flowSlow}>
          <path
            d="M0 9 C 12 4, 24 14, 36 9 C 48 4, 60 14, 72 9 C 84 4, 96 14, 108 9 C 120 4, 132 14, 144 9 C 156 4, 168 14, 180 9 L 200 9 L 200 24 L 0 24 Z"
            fill="var(--river)"
            opacity="0.85"
          />
        </motion.g>
        <motion.g {...flow}>
          <path
            d="M0 13 C 10 9, 20 17, 30 13 C 40 9, 50 17, 60 13 C 70 9, 80 17, 90 13 C 100 9, 110 17, 120 13 C 130 9, 140 17, 150 13 C 160 9, 170 17, 180 13 L 200 13 L 200 24 L 0 24 Z"
            fill="var(--river-foam)"
            opacity="0.5"
          />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * The shared jungle scene — gradient sky, faint trees, swaying canopy vines,
 * drifting bananas, a flowing river, and a forest floor of palms. Purely
 * decorative and non-interactive; render page content above it. Used by both
 * the landing page and the game.
 */
export function JungleBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.bgTrees}>
        <span style={{ left: "2%" }}>🌴</span>
        <span style={{ right: "3%" }}>🌳</span>
      </div>

      <div className={styles.headerShade} />

      <div className={styles.canopy}>
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

      <div className={styles.bananas}>
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

      <River />

      <div className={styles.jungleFloor}>
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
