import { STAT_MAX, STAT_MIN, type PetState } from "./types";

/** Fullness lost per real-world minute. */
export const FULLNESS_DECAY_PER_MINUTE = 5;
/** Happiness lost per real-world minute (depletes faster than fullness, so the
 *  meter visibly counts down and playing actually matters). */
export const HAPPINESS_DECAY_PER_MINUTE = 8;
/** Fullness restored by one feed. */
export const FEED_AMOUNT = 25;
/** Happiness restored each time Punch plays (a happy feed → spin). */
export const PLAY_AMOUNT = 30;
/** Fullness above which Punch is "happy" — well-fed enough to play. */
export const HAPPY_FULLNESS = 60;
/** Feed presses while already full before Punch vomits. */
export const OVERFEED_LIMIT = 5;
/** Fullness Punch is left with after throwing up. */
export const SICK_FULLNESS = 20;
/** Happiness lost when Punch over-eats and pukes — being sick is no fun. */
export const SICK_HAPPINESS_PENALTY = 40;
/** Bananas on hand at the start, and the cap they regrow back up to. */
export const BANANA_MAX = 10;
/** Bananas that regrow per real-world minute (≈ one every two minutes). */
export const BANANA_REGEN_PER_MINUTE = 0.5;

const MS_PER_MINUTE = 60_000;

/** Clamp a stat into the valid [STAT_MIN, STAT_MAX] range. */
export function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  return Math.min(max, Math.max(min, value));
}

/** A brand-new, fully-fed and delighted pet with a full bunch of bananas. */
export function createInitialState(now: number): PetState {
  return {
    fullness: STAT_MAX,
    happiness: STAT_MAX,
    bananas: BANANA_MAX,
    lastTick: now,
    sick: false,
    overfeed: 0,
  };
}

/** Whether Punch is well-fed enough to be happy (and thus willing to play). */
export function isHappy(state: PetState): boolean {
  return !state.sick && state.fullness > HAPPY_FULLNESS;
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
  const happiness = clamp(state.happiness - elapsedMinutes * HAPPINESS_DECAY_PER_MINUTE);
  // Bananas regrow over time (not a 0–100 stat), capped at the bunch size.
  const bananas = clamp(state.bananas + elapsedMinutes * BANANA_REGEN_PER_MINUTE, 0, BANANA_MAX);
  // Once he's digested enough to hold a full portion again, the over-feed
  // streak resets. (Checking `< STAT_MAX` here would clear the streak on the
  // first sliver of decay — which, since decay runs before every feed, made
  // over-feeding impossible to ever reach.)
  const overfeed = fullness + FEED_AMOUNT <= STAT_MAX ? 0 : state.overfeed;
  return { ...state, fullness, happiness, bananas, overfeed, lastTick: now };
}

/** Play with Punch — restores happiness up to the max. Pure. */
export function play(state: PetState): PetState {
  return { ...state, happiness: clamp(state.happiness + PLAY_AMOUNT) };
}

/**
 * Feed the pet. Restores fullness up to the max; feeding while already full
 * builds an over-feed streak, and the OVERFEED_LIMIT-th such press makes Punch
 * vomit and turn sick (fullness crashes to SICK_FULLNESS). Each feed costs one
 * banana — feeding while sick or out of bananas does nothing (returns the same
 * state, unchanged reference). Pure.
 */
export function feed(state: PetState): PetState {
  if (state.sick || state.bananas < 1) {
    return state;
  }
  const bananas = state.bananas - 1;
  // No room for a full portion → he's being crammed past full. Use overflow
  // rather than an exact `>= STAT_MAX` check so the streak survives the sliver
  // of decay applied before each press in the live game loop.
  if (state.fullness + FEED_AMOUNT > STAT_MAX) {
    const overfeed = state.overfeed + 1;
    if (overfeed >= OVERFEED_LIMIT) {
      return {
        ...state,
        fullness: SICK_FULLNESS,
        happiness: clamp(state.happiness - SICK_HAPPINESS_PENALTY),
        sick: true,
        overfeed: 0,
        bananas,
      };
    }
    return { ...state, fullness: STAT_MAX, overfeed, bananas };
  }
  return { ...state, fullness: clamp(state.fullness + FEED_AMOUNT), overfeed: 0, bananas };
}

/** Recover from sickness. Pure. */
export function recover(state: PetState): PetState {
  return { ...state, sick: false, overfeed: 0 };
}
