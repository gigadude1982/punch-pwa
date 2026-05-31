import { motion, useReducedMotion } from "framer-motion";
import styles from "./River.module.css";

/**
 * A decorative, animated river that sits in the jungle background scene
 * directly beneath Punch's rock. The water flow is conveyed by two looping
 * wave bands that drift horizontally via framer-motion. It is purely
 * decorative and renders behind the rock (lower z-index). Respects
 * prefers-reduced-motion by holding the waves still.
 */
export function River() {
  const reduceMotion = useReducedMotion();

  const driftA = reduceMotion ? { x: 0 } : { x: [0, -40, 0] };
  const driftB = reduceMotion ? { x: 0 } : { x: [0, 36, 0] };

  return (
    <div className={styles.river} aria-hidden="true" data-testid="river">
      <svg
        className={styles.water}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3fa7d6" />
            <stop offset="55%" stopColor="#2a6f97" />
            <stop offset="100%" stopColor="#173f5f" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="200" fill="url(#riverGradient)" />

        <motion.path
          d="M-80 70 q60 -22 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V200 H-80 Z"
          fill="#5cc0e8"
          fillOpacity={0.45}
          animate={driftA}
          transition={
            reduceMotion ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }
          }
          data-testid="river-wave-a"
        />
        <motion.path
          d="M-80 110 q70 -18 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V200 H-80 Z"
          fill="#a7e0f5"
          fillOpacity={0.35}
          animate={driftB}
          transition={
            reduceMotion ? undefined : { duration: 9, ease: "easeInOut", repeat: Infinity }
          }
          data-testid="river-wave-b"
        />
      </svg>
    </div>
  );
}
