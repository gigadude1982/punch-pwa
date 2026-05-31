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
 * A flowing river that sits beneath Punch's rock. Renders an inline SVG so its
 * colours match the jungle palette, and animates two staggered wave bands
 * horizontally to convey moving water. Honours `prefers-reduced-motion`.
 */
function River() {
  const reduceMotion = useReducedMotion();
  const flow = reduceMotion ? {} : { x: ["0%", "-50%"] };
  const flowSlow = reduceMotion ? {} : { x: ["-50%", "0%"] };

  return (
    <div className={styles.river} data-testid="river">
      <svg
        className={styles.riverSvg}
        viewBox="0 0 200 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="riverFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa0c9" />
            <stop offset="100%" stopColor="#1c5e7a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="30" fill="url(#riverFill)" />
        <motion.path
          d="M0 10 Q 12.5 4 25 10 T 50 10 T 75 10 T 100 10 T 125 10 T 150 10 T 175 10 T 200 10 V30 H0 Z"
          fill="rgba(255,255,255,0.18)"
          animate={flow}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        />
        <motion.path
          d="M0 18 Q 16.6 13 33.3 18 T 66.6 18 T 100 18 T 133.3 18 T 166.6 18 T 200 18 V30 H0 Z"
          fill="rgba(255,255,255,0.1)"
          animate={flowSlow}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
        />
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
