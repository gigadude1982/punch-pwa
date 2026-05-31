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
 * A flowing river that sits behind Punch's rock. Rendered as a wide,
 * full-width SVG band of stacked wavy stripes; framer-motion shifts the
 * stripes horizontally to convey gently moving water. Honors
 * prefers-reduced-motion by holding still. Colors are drawn from the
 * jungle palette (CSS variables on .backdrop) for visual consistency.
 */
function River() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.river} data-testid="jungle-river" aria-hidden="true">
      <motion.svg
        className={styles.riverSvg}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        animate={reduceMotion ? undefined : { x: [0, -120, 0] }}
        transition={
          reduceMotion ? undefined : { duration: 9, ease: "easeInOut", repeat: Infinity }
        }
      >
        <rect x="-200" y="0" width="1600" height="200" className={styles.riverBase} />
        <path
          className={styles.riverWave1}
          d="M-200 60 Q 100 40 400 60 T 1000 60 T 1600 60 V 200 H -200 Z"
        />
        <path
          className={styles.riverWave2}
          d="M-200 110 Q 150 90 450 110 T 1050 110 T 1600 110 V 200 H -200 Z"
        />
        <path
          className={styles.riverWave3}
          d="M-200 150 Q 200 135 500 150 T 1100 150 T 1600 150 V 200 H -200 Z"
        />
      </motion.svg>
    </div>
  );
}

/**
 * The shared jungle scene — gradient sky, faint trees, swaying canopy vines,
 * drifting bananas, a flowing river, and a forest floor of palms. Purely
 * decorative and non-interactive; render page content (including Punch's rock)
 * above it. Used by both the landing page and the game.
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
