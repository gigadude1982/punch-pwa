import { motion, useReducedMotion } from "framer-motion";
import styles from "./River.module.css";

/**
 * A decorative animated river that flows beneath Punch's rock in the jungle
 * scene. Rendered as an inline SVG so its colors track the surrounding palette,
 * with framer-motion driving a looping horizontal wave drift. Purely
 * decorative and non-interactive; it sits behind the rock via a low z-index.
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
          <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aa7c2" />
            <stop offset="55%" stopColor="#1f6f99" />
            <stop offset="100%" stopColor="#0f4d70" />
          </linearGradient>
        </defs>

        <rect x="0" y="40" width="1200" height="160" fill="url(#riverGradient)" />

        <motion.path
          d="M0 60 Q150 30 300 60 T600 60 T900 60 T1200 60 V200 H0 Z"
          fill="#5cc2dc"
          opacity={0.45}
          animate={reduceMotion ? undefined : { x: [0, -300, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 8, ease: "easeInOut", repeat: Infinity }
          }
        />

        <motion.path
          d="M0 90 Q150 70 300 90 T600 90 T900 90 T1200 90 V200 H0 Z"
          fill="#2f93b8"
          opacity={0.6}
          animate={reduceMotion ? undefined : { x: [0, 300, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 11, ease: "easeInOut", repeat: Infinity }
          }
        />
      </svg>
    </div>
  );
}
