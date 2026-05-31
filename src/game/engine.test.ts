import {
  FEED_AMOUNT,
  FULLNESS_DECAY_PER_MINUTE,
  OVERFEED_LIMIT,
  SICK_FULLNESS,
  applyDecay,
  clamp,
  createInitialState,
  feed,
  recover,
} from "./engine";
import { STAT_MAX, type PetState } from "./types";

/** A healthy pet at the given fullness, for terse test setup. */
function pet(overrides: Partial<PetState> = {}): PetState {
  return { fullness: 50, lastTick: 0, sick: false, overfeed: 0, ...overrides };
}

describe("clamp", () => {
  it("bounds values to [0, 100]", () => {
    expect(clamp(-10)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(42)).toBe(42);
  });
});

describe("createInitialState", () => {
  it("starts fully fed and healthy at the given time", () => {
    const state = createInitialState(1_000);
    expect(state).toEqual({ fullness: 100, lastTick: 1_000, sick: false, overfeed: 0 });
  });
});

describe("applyDecay", () => {
  it("reduces fullness proportional to elapsed minutes and advances lastTick", () => {
    const start = createInitialState(0);
    const twoMinutes = 2 * 60_000;
    const decayed = applyDecay(start, twoMinutes);
    expect(decayed.fullness).toBe(100 - 2 * FULLNESS_DECAY_PER_MINUTE);
    expect(decayed.lastTick).toBe(twoMinutes);
  });

  it("never drops below zero", () => {
    const decayed = applyDecay(pet({ fullness: 10 }), 60 * 60_000); // an hour
    expect(decayed.fullness).toBe(0);
  });

  it("is a no-op when no time has elapsed and never raises stats on clock skew", () => {
    const state = pet({ fullness: 50, lastTick: 1_000 });
    expect(applyDecay(state, 1_000)).toBe(state);
    expect(applyDecay(state, 0).fullness).toBe(50); // negative elapsed floored at 0
  });

  it("keeps the over-feed streak while he's still too full for a full portion", () => {
    // One minute of decay (100 → 95) still leaves no room for a full feed, so
    // the streak must survive — otherwise the decay applied before every feed
    // would reset it and over-feeding could never trigger.
    const decayed = applyDecay(pet({ fullness: 100, overfeed: 3 }), 60_000);
    expect(decayed.fullness).toBeGreaterThan(STAT_MAX - FEED_AMOUNT);
    expect(decayed.overfeed).toBe(3);
  });

  it("clears the over-feed streak once he has room for a full portion again", () => {
    const decayed = applyDecay(pet({ fullness: 100, overfeed: 3 }), 6 * 60_000); // → 70
    expect(decayed.fullness).toBeLessThanOrEqual(STAT_MAX - FEED_AMOUNT);
    expect(decayed.overfeed).toBe(0);
  });
});

describe("feed", () => {
  it("restores fullness, clamped at the max", () => {
    expect(feed(pet({ fullness: 40 })).fullness).toBe(40 + FEED_AMOUNT);
    expect(feed(pet({ fullness: 90 })).fullness).toBe(100);
  });

  it("does not mutate the input state", () => {
    const state = pet({ fullness: 40 });
    feed(state);
    expect(state.fullness).toBe(40);
  });

  it("counts feeds landed while already full toward the over-feed limit", () => {
    const fed = feed(pet({ fullness: 100, overfeed: 0 }));
    expect(fed.fullness).toBe(100);
    expect(fed.overfeed).toBe(1);
    expect(fed.sick).toBe(false);
  });

  it("vomits and turns sick on the OVERFEED_LIMIT-th press while full", () => {
    const stuffed = pet({ fullness: 100, overfeed: OVERFEED_LIMIT - 1 });
    const sick = feed(stuffed);
    expect(sick.sick).toBe(true);
    expect(sick.fullness).toBe(SICK_FULLNESS);
    expect(sick.overfeed).toBe(0);
  });

  it("ignores feeding while sick", () => {
    const sick = pet({ fullness: SICK_FULLNESS, sick: true });
    expect(feed(sick)).toBe(sick);
  });

  it("still makes him sick when mashed in the live loop (decay before each press)", () => {
    // Reproduces the reported bug: the UI applies decay before every feed, so a
    // sliver of fullness is always lost first. The over-feed streak must survive
    // that for repeated presses to ever trigger sickness.
    let state = pet({ fullness: STAT_MAX, lastTick: 0 });
    let t = 0;
    for (let i = 0; i < OVERFEED_LIMIT; i++) {
      t += 5_000; // ~5s between presses, matching the game's decay cadence
      state = feed(applyDecay(state, t));
    }
    expect(state.sick).toBe(true);
    expect(state.fullness).toBe(SICK_FULLNESS);
  });
});

describe("recover", () => {
  it("clears sickness and the over-feed streak", () => {
    const healthy = recover(pet({ sick: true, overfeed: 2 }));
    expect(healthy.sick).toBe(false);
    expect(healthy.overfeed).toBe(0);
  });
});
