/**
 * Persisted pet state. Stats run 0–100 where higher is better; they decay over
 * time and are replenished by player actions.
 *
 * The foundation models a single stat (fullness). Additional stats — e.g.
 * happiness, energy — are intended to be added the same way (a field here, an
 * action in the engine, a meter + button in the UI).
 */
export interface PetState {
  /** Fullness: 100 = just fed, 0 = starving. Raised by feeding, decays over time. */
  fullness: number;
  /** Epoch milliseconds when time-based decay was last applied. */
  lastTick: number;
  /** True after over-feeding: Punch vomited and feels sick (feeding is disabled). */
  sick: boolean;
  /** Feed presses landed while already full — at OVERFEED_LIMIT he vomits. */
  overfeed: number;
}

export const STAT_MIN = 0;
export const STAT_MAX = 100;
