import { useGame } from "../game/GameProvider";
import { Pet } from "./Pet";
import { StatMeter } from "./StatMeter";
import styles from "./Game.module.css";

/** The game shell: the pet, its stat meters, and the action buttons. */
export function Game() {
  const { pet, feed, spinCount } = useGame();
  return (
    <section className={styles.game}>
      <Pet fullness={pet.fullness} sick={pet.sick} spinCount={spinCount} />
      <StatMeter label="Fullness 🍌" value={pet.fullness} />
      <StatMeter label="Happiness 😊" value={pet.happiness} />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.action}
          onClick={feed}
          disabled={pet.sick}
          title={pet.sick ? "Punch is too sick to eat" : undefined}
        >
          Feed 🍌
        </button>
      </div>
    </section>
  );
}
