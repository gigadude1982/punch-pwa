import { motion, useReducedMotion } from "framer-motion";
import styles from "./River.module.css";

/**
 * A decorative river that flows beneath Punch's rock in the jungle scene.
 *
 * Rendered as an inline SVG so its colors track the shared palette and it
 * scales cleanly across resolutions via `preserveAspectRatio`. Two stacked
 * wave bands are translated horizontally on a seamless loop (framer-motion) to
 * convey flowing water. Purely decorative and non-interactive; it is given a
 * low z-index so it always renders behind the rock. Respects
 * `prefers-reduced-motion`.
 */
export function River() {
  const reduceMotion = useReducedMotion();

  const frontAnimate = reduceMotion ? undefined : { x: ["0%", "-50%"] };
  const backAnimate = reduceMotion ? undefined : { x: ["-50%", "0%"] };

  return (
    <div className={styles.river} data-testid="river" aria-hidden="true">
      <svg
        className={styles.water}
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        role="presentation"
      >
        <rect x="0" y="0" width="200" height="60" fill="var(--river-deep)" />

        <motion.path
          data-testid="river-wave-back"
          fill="var(--river)"
          fillOpacity="0.65"
          d="M0 24 q 25 -10 50 0 t 50 0 t 50 0 t 50 0 V60 H0 Z"
          animate={backAnimate}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
        <motion.path
          data-testid="river-wave-front"
          fill="var(--river-foam)"
          fillOpacity="0.8"
          d="M0 32 q 25 10 50 0 t 50 0 t 50 0 t 50 0 V60 H0 Z"
          animate={frontAnimate}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
