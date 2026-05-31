import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import styles from "./River.module.css";

/** Looping horizontal drift for the back wave layer. */
const flow = { x: ["0%", "-50%"] };
const flowTransition: Transition = {
  duration: 12,
  ease: "linear",
  repeat: Infinity,
};

/** Slower, offset drift for the front wave layer to add depth. */
const flowSlow = { x: ["-50%", "0%"] };
const flowSlowTransition: Transition = {
  duration: 18,
  ease: "linear",
  repeat: Infinity,
};

/**
 * A flowing river that sits in the jungle scene directly beneath Punch's rock.
 * Purely decorative and non-interactive. Rendered with a low z-index so it
 * always appears behind the rock. The water motion is driven by framer-motion
 * (two looping wave layers translated horizontally) and is disabled for users
 * who prefer reduced motion via the colocated CSS module.
 */
export function River() {
  return (
    <div className={styles.river} aria-hidden="true" data-testid="river">
      <svg
        className={styles.water}
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className={styles.base} x="0" y="0" width="200" height="60" />
        <motion.g
          className={styles.waveBack}
          data-testid="river-wave-back"
          animate={flow}
          transition={flowTransition}
        >
          <path d="M0 22 q12.5 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V60 H0 Z" />
        </motion.g>
        <motion.g
          className={styles.waveFront}
          data-testid="river-wave-front"
          animate={flowSlow}
          transition={flowSlowTransition}
        >
          <path d="M0 34 q12.5 8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V60 H0 Z" />
        </motion.g>
      </svg>
    </div>
  );
}
