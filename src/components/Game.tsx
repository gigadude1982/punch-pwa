import { useGame } from "../game/GameProvider";
import { BANANA_MAX } from "../game/engine";
import { Pet } from "./Pet";
import { StatMeter } from "./StatMeter";
import styles from "./Game.module.css";

/** The game shell: the pet, its stat meters, and the action buttons. */
export function Game() {
  const { pet, feed, spinCount } = useGame();
  const bananas = Math.floor(pet.bananas);
  const outOfBananas = bananas < 1;
  return (
    <section className={styles.game}>
      <Pet fullness={pet.fullness} sick={pet.sick} spinCount={spinCount} />
      <StatMeter label="Fullness 🍌" value={pet.fullness} />
      <StatMeter label="Happiness 😊" value={pet.happiness} />
      <p className={styles.bananaStock} aria-label={`${bananas} of ${BANANA_MAX} bananas left`}>
        🍌 {bananas} / {BANANA_MAX}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.action}
          onClick={feed}
          disabled={pet.sick || outOfBananas}
          title={
            pet.sick
              ? "Punch is too sick to eat"
              : outOfBananas
                ? "Out of bananas — they regrow over time"
                : undefined
          }
        >
          Feed 🍌
        </button>
      </div>
    </section>
  );
}
