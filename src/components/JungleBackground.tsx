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
 * A flowing jungle river. Rendered as a tiling inline SVG band whose wave
 * layers slide horizontally to convey moving water. Sits low in the scene so it
 * appears beneath Punch's rock, and respects reduced-motion preferences. Purely
 * decorative and non-interactive.
 */
function River() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.river} data-testid="jungle-river">
      <motion.svg
        className={styles.riverWaves}
        viewBox="0 0 240 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : { repeat: Infinity, repeatType: "loop", ease: "linear", duration: 12 }
        }
      >
        <path
          className={styles.riverDeep}
          d="M0 30 Q15 18 30 30 T60 30 T90 30 T120 30 T150 30 T180 30 T210 30 T240 30 V60 H0 Z"
        />
        <path
          className={styles.riverMid}
          d="M0 38 Q15 28 30 38 T60 38 T90 38 T120 38 T150 38 T180 38 T210 38 T240 38 V60 H0 Z"
        />
        <path
          className={styles.riverShine}
          d="M0 26 Q15 20 30 26 T60 26 T90 26 T120 26 T150 26 T180 26 T210 26 T240 26 V32 Q225 38 210 32 T180 32 T150 32 T120 32 T90 32 T60 32 T30 32 T0 32 Z"
        />
      </motion.svg>
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
