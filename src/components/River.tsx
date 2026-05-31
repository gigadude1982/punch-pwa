import { motion, useReducedMotion } from "framer-motion";
import styles from "./River.module.css";

/**
 * Decorative flowing river that sits in the jungle floor, directly beneath
 * Punch's rock. Rendered behind the rock via a lower z-index (see the CSS
 * module). Purely decorative and non-interactive; the flowing-water effect is
 * driven by framer-motion and is disabled when the user prefers reduced motion.
 */
export function River() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.river} data-testid="river" aria-hidden="true">
      <svg
        className={styles.water}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="riverDepth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa0c9" />
            <stop offset="55%" stopColor="#1f6f9c" />
            <stop offset="100%" stopColor="#0f4a6e" />
          </linearGradient>
        </defs>

        {/* Base water body */}
        <rect x="0" y="0" width="1200" height="200" fill="url(#riverDepth)" />

        {/* Flowing surface ripples driven by horizontal translation on a loop. */}
        <motion.g
          data-testid="river-flow"
          animate={reduceMotion ? undefined : { x: [-300, 0] }}
          transition={
            reduceMotion ? undefined : { duration: 6, ease: "linear", repeat: Infinity }
          }
        >
          <path
            d="M-300 70 Q-225 50 -150 70 T0 70 T150 70 T300 70 T450 70 T600 70 T750 70 T900 70 T1050 70 T1200 70 T1350 70 L1350 200 L-300 200 Z"
            fill="#5cc0e0"
            opacity="0.35"
          />
        </motion.g>

        <motion.g
          animate={reduceMotion ? undefined : { x: [0, -300] }}
          transition={
            reduceMotion ? undefined : { duration: 9, ease: "linear", repeat: Infinity }
          }
        >
          <path
            d="M-300 120 Q-225 105 -150 120 T0 120 T150 120 T300 120 T450 120 T600 120 T750 120 T900 120 T1050 120 T1200 120 T1350 120 L1350 200 L-300 200 Z"
            fill="#7fd4ee"
            opacity="0.25"
          />
        </motion.g>
      </svg>
    </div>
  );
}
