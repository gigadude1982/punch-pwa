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
import type { PetState } from "./types";

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

  it("clears the over-feed streak once he's no longer full", () => {
    const decayed = applyDecay(pet({ fullness: 100, overfeed: 3 }), 60_000);
    expect(decayed.fullness).toBeLessThan(100);
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
});

describe("recover", () => {
  it("clears sickness and the over-feed streak", () => {
    const healthy = recover(pet({ sick: true, overfeed: 2 }));
    expect(healthy.sick).toBe(false);
    expect(healthy.overfeed).toBe(0);
  });
});
