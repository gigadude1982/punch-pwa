import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { playHoot, playScream, playVomit } from "../sound";
import styles from "./Pet.module.css";

interface PetProps {
  fullness: number;
  /** True while Punch is recovering from over-eating. */
  sick: boolean;
}

type Mood = "happy" | "peckish" | "hungry" | "sick";

function moodFor(fullness: number, sick: boolean): Mood {
  if (sick) {
    return "sick";
  }
  if (fullness > 60) {
    return "happy";
  }
  return fullness > 30 ? "peckish" : "hungry";
}

const MOOD_CAPTION: Record<Mood, string> = {
  happy: "Punch is happy 😊",
  peckish: "Punch could use a snack 🍌",
  hungry: "Punch is hungry! 🍌",
  sick: "Punch is sick… 🤢",
};

/** Fullness at/above which the plush orangutan appears… */
const COMPANION_IN = 100;
/** …and below which it vanishes (with a scream). */
const COMPANION_OUT = 25;

/**
 * Punch the Japanese macaque. Bobs idly (faster when hungry), spins a full 360
 * and hoots when stuffed to 100%, and retches when over-fed. His plush
 * orangutan appears once he's fully happy and runs off — with a scream — if he
 * gets too hungry.
 */
export function Pet({ fullness, sick }: PetProps) {
  const mood = moodFor(fullness, sick);
  const spin = useAnimationControls();

  const [companionVisible, setCompanionVisible] = useState(fullness >= COMPANION_IN);
  const [showVomit, setShowVomit] = useState(false);

  const prevFullness = useRef(fullness);
  const prevSick = useRef(sick);
  const prevCompanion = useRef(companionVisible);

  // Hit 100% → spin + hoot (rising edge only, so not on first load).
  useEffect(() => {
    if (prevFullness.current < COMPANION_IN && fullness >= COMPANION_IN) {
      playHoot();
      void spin
        .start({ rotate: 360, transition: { duration: 0.8, ease: "easeInOut" } })
        .then(() => spin.set({ rotate: 0 }));
    }
    prevFullness.current = fullness;
  }, [fullness, spin]);

  // Orangutan hysteresis: in at 100%, out below 25%, latched between.
  useEffect(() => {
    setCompanionVisible((visible) => {
      if (fullness >= COMPANION_IN) {
        return true;
      }
      if (fullness < COMPANION_OUT) {
        return false;
      }
      return visible;
    });
  }, [fullness]);

  // Scream when the orangutan runs off.
  useEffect(() => {
    if (prevCompanion.current && !companionVisible) {
      playScream();
    }
    prevCompanion.current = companionVisible;
  }, [companionVisible]);

  // Over-fed → vomit splat + retch sound (rising edge).
  useEffect(() => {
    if (prevSick.current === sick) {
      return;
    }
    prevSick.current = sick;
    if (sick) {
      playVomit();
      setShowVomit(true);
      const id = setTimeout(() => setShowVomit(false), 1200);
      return () => clearTimeout(id);
    }
  }, [sick]);

  return (
    <div className={styles.pet} data-mood={mood}>
      <div className={styles.stage}>
        <motion.div className={styles.sprite} animate={spin}>
          <motion.div
            role="img"
            aria-label={`Punch the macaque, looking ${mood}`}
            animate={{ y: sick ? [0, -4, 0] : [0, -12, 0] }}
            transition={{
              duration: mood === "hungry" ? 1.1 : sick ? 0.5 : 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {sick ? "🤢" : "🐒"}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {companionVisible && (
            <motion.div
              key="companion"
              className={styles.companion}
              role="img"
              aria-label="Punch's plush orangutan"
              initial={{ opacity: 0, scale: 0.4, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.4, x: -10 }}
              transition={{ duration: 0.4 }}
            >
              🦧
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showVomit && (
            <motion.div
              key="vomit"
              className={styles.vomit}
              initial={{ opacity: 0, y: -12, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              🤮
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className={styles.mood}>{MOOD_CAPTION[mood]}</p>
    </div>
  );
}
