/**
 * Persisted pet state. Stats run 0–100 where higher is better; they decay over
 * time and are replenished by player actions.
 *
 * The foundation models fullness + happiness. Further stats — e.g. energy —
 * are intended to be added the same way (a field here, decay + an action in the
 * engine, a meter in the UI).
 */
export interface PetState {
  /** Fullness: 100 = just fed, 0 = starving. Raised by feeding, decays over time. */
  fullness: number;
  /** Happiness: 100 = delighted, 0 = miserable. Raised by playing (feeding him
   *  while he's happy makes him spin), decays over time. */
  happiness: number;
  /** Bananas on hand to feed Punch. Each feed costs one; they regrow slowly
   *  over time up to BANANA_MAX, so feeding is rate-limited. */
  bananas: number;
  /** Epoch milliseconds when time-based decay was last applied. */
  lastTick: number;
  /** True after over-feeding: Punch vomited and feels sick (feeding is disabled). */
  sick: boolean;
  /** Feed presses landed while already full — at OVERFEED_LIMIT he vomits. */
  overfeed: number;
}

export const STAT_MIN = 0;
export const STAT_MAX = 100;
