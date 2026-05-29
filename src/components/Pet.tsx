import { motion } from "framer-motion";
import styles from "./Pet.module.css";

interface PetProps {
  fullness: number;
}

type Mood = "happy" | "peckish" | "hungry";

function moodFor(fullness: number): Mood {
  if (fullness > 60) {
    return "happy";
  }
  return fullness > 30 ? "peckish" : "hungry";
}

const MOOD_CAPTION: Record<Mood, string> = {
  happy: "Punch is happy 😊",
  peckish: "Punch could use a snack 🍌",
  hungry: "Punch is hungry! 🍌",
};

/** Punch the orangutan. Bobs idly, and bobs faster + looks worried when hungry. */
export function Pet({ fullness }: PetProps) {
  const mood = moodFor(fullness);
  return (
    <div className={styles.pet} data-mood={mood}>
      <motion.div
        className={styles.sprite}
        role="img"
        aria-label={`Punch the orangutan, looking ${mood}`}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: mood === "hungry" ? 1.1 : 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        🦧
      </motion.div>
      <p className={styles.mood}>{MOOD_CAPTION[mood]}</p>
    </div>
  );
}
