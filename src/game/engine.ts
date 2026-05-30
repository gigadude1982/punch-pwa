import { STAT_MAX, STAT_MIN, type PetState } from "./types";

/** Fullness lost per real-world minute. */
export const FULLNESS_DECAY_PER_MINUTE = 5;
/** Fullness restored by one feed. */
export const FEED_AMOUNT = 25;
/** Feed presses while already full before Punch vomits. */
export const OVERFEED_LIMIT = 5;
/** Fullness Punch is left with after throwing up. */
export const SICK_FULLNESS = 20;

const MS_PER_MINUTE = 60_000;

/** Clamp a stat into the valid [STAT_MIN, STAT_MAX] range. */
export function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  return Math.min(max, Math.max(min, value));
}

/** A brand-new, fully-fed pet. */
export function createInitialState(now: number): PetState {
  return { fullness: STAT_MAX, lastTick: now, sick: false, overfeed: 0 };
}

/**
 * Apply time-based decay for the interval between `state.lastTick` and `now`.
 * Pure — returns a new state and never mutates the input. Elapsed time is
 * floored at zero so a stale/clock-skewed `lastTick` can't raise stats.
 */
export function applyDecay(state: PetState, now: number): PetState {
  const elapsedMinutes = (now - state.lastTick) / MS_PER_MINUTE;
  if (elapsedMinutes === 0) {
    return state;
  }
  if (elapsedMinutes < 0) {
    return { ...state, lastTick: now };
  }
  const fullness = clamp(state.fullness - elapsedMinutes * FULLNESS_DECAY_PER_MINUTE);
  // Once he's no longer stuffed, the over-feed streak resets.
  const overfeed = fullness < STAT_MAX ? 0 : state.overfeed;
  return { ...state, fullness, overfeed, lastTick: now };
}

/**
 * Feed the pet. Restores fullness up to the max; feeding while already full
 * builds an over-feed streak, and the OVERFEED_LIMIT-th such press makes Punch
 * vomit and turn sick (fullness crashes to SICK_FULLNESS). Feeding a sick pet
 * does nothing. Pure.
 */
export function feed(state: PetState): PetState {
  if (state.sick) {
    return state;
  }
  if (state.fullness >= STAT_MAX) {
    const overfeed = state.overfeed + 1;
    if (overfeed >= OVERFEED_LIMIT) {
      return { ...state, fullness: SICK_FULLNESS, sick: true, overfeed: 0 };
    }
    return { ...state, fullness: STAT_MAX, overfeed };
  }
  return { ...state, fullness: clamp(state.fullness + FEED_AMOUNT), overfeed: 0 };
}

/** Recover from sickness. Pure. */
export function recover(state: PetState): PetState {
  return { ...state, sick: false, overfeed: 0 };
}
