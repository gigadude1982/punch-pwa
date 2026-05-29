import type { PetState } from "./types";

/** localStorage key. Versioned so a future state-shape change can migrate/reset. */
export const STORAGE_KEY = "punch.pet.v1";

/** Load persisted pet state, or null if absent, unparseable, or malformed. */
export function loadState(): PetState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PetState>;
    if (typeof parsed.fullness !== "number" || typeof parsed.lastTick !== "number") {
      return null;
    }
    return { fullness: parsed.fullness, lastTick: parsed.lastTick };
  } catch {
    return null;
  }
}

/** Persist pet state. Best-effort — quota/availability errors are swallowed. */
export function saveState(state: PetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore — persistence is non-critical
  }
}
