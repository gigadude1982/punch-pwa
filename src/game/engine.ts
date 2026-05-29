import { STAT_MAX, STAT_MIN, type PetState } from "./types";

/** Fullness lost per real-world minute. */
export const FULLNESS_DECAY_PER_MINUTE = 5;
/** Fullness restored by one feed. */
export const FEED_AMOUNT = 25;

const MS_PER_MINUTE = 60_000;

/** Clamp a stat into the valid [STAT_MIN, STAT_MAX] range. */
export function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  return Math.min(max, Math.max(min, value));
}

/** A brand-new, fully-fed pet. */
export function createInitialState(now: number): PetState {
  return { fullness: STAT_MAX, lastTick: now };
}

/**
 * Apply time-based decay for the interval between `state.lastTick` and `now`.
 * Pure — returns a new state and never mutates the input. Elapsed time is
 * floored at zero so a stale/clock-skewed `lastTick` can't raise stats.
 */
export function applyDecay(state: PetState, now: number): PetState {
  const elapsedMinutes = Math.max(0, (now - state.lastTick) / MS_PER_MINUTE);
  if (elapsedMinutes === 0) {
    return state;
  }
  const fullness = clamp(state.fullness - elapsedMinutes * FULLNESS_DECAY_PER_MINUTE);
  return { ...state, fullness, lastTick: now };
}

/** Feed the pet, restoring fullness (clamped at the max). Pure. */
export function feed(state: PetState): PetState {
  return { ...state, fullness: clamp(state.fullness + FEED_AMOUNT) };
}
