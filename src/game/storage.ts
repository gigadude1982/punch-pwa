import { STAT_MAX, type PetState } from "./types";
import { BANANA_MAX } from "./engine";

/**
 * Only the durable stats are persisted. Transient flags (sick, overfeed) are
 * intentionally not saved — Punch always wakes up recovered.
 */
type PersistedPet = Pick<PetState, "fullness" | "happiness" | "bananas" | "lastTick">;

/** localStorage key. Versioned so a future state-shape change can migrate/reset. */
export const STORAGE_KEY = "punch.pet.v1";

/** Load persisted pet state, or null if absent, unparseable, or malformed. */
export function loadState(): PersistedPet | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PetState>;
    if (typeof parsed.fullness !== "number" || typeof parsed.lastTick !== "number") {
      return null;
    }
    // happiness was added later — default a save that predates it to fully happy.
    const happiness = typeof parsed.happiness === "number" ? parsed.happiness : STAT_MAX;
    // bananas was added later too — default a predating save to a full bunch.
    const bananas = typeof parsed.bananas === "number" ? parsed.bananas : BANANA_MAX;
    return { fullness: parsed.fullness, happiness, bananas, lastTick: parsed.lastTick };
  } catch {
    return null;
  }
}

/** Persist pet state. Best-effort — quota/availability errors are swallowed. */
export function saveState(state: PersistedPet): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        fullness: state.fullness,
        happiness: state.happiness,
        bananas: state.bananas,
        lastTick: state.lastTick,
      }),
    );
  } catch {
    // ignore — persistence is non-critical
  }
}
