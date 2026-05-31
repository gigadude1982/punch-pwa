import { motion, useReducedMotion } from "framer-motion";
import styles from "./River.module.css";

/**
 * A decorative animated river that sits behind Punch's rock in the jungle
 * scene. The flowing-water effect is produced by translating two stacked wave
 * paths horizontally on a loop via framer-motion. Purely decorative; rendered
 * with a lower z-index than the rock so it always appears beneath it.
 */
export function River() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.river} aria-hidden="true" data-testid="river">
      <svg
        className={styles.water}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="riverBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5fcfe0" />
            <stop offset="55%" stopColor="#2d9bd1" />
            <stop offset="100%" stopColor="#176fa6" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="200" fill="url(#riverBody)" />

        <motion.path
          d="M0 60 Q150 30 300 60 T600 60 T900 60 T1200 60 V0 H0 Z"
          fill="rgba(255, 255, 255, 0.22)"
          animate={reduceMotion ? undefined : { x: [0, -600] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 8, ease: "linear", repeat: Infinity }
          }
        />
        <motion.path
          d="M0 110 Q150 140 300 110 T600 110 T900 110 T1200 110 V200 H0 Z"
          fill="rgba(255, 255, 255, 0.15)"
          animate={reduceMotion ? undefined : { x: [-600, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 11, ease: "linear", repeat: Infinity }
          }
        />
      </svg>
    </div>
  );
}
