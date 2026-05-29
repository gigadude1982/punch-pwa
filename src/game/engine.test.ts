import {
  FEED_AMOUNT,
  FULLNESS_DECAY_PER_MINUTE,
  applyDecay,
  clamp,
  createInitialState,
  feed,
} from "./engine";

describe("clamp", () => {
  it("bounds values to [0, 100]", () => {
    expect(clamp(-10)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(42)).toBe(42);
  });
});

describe("createInitialState", () => {
  it("starts fully fed at the given time", () => {
    const state = createInitialState(1_000);
    expect(state).toEqual({ fullness: 100, lastTick: 1_000 });
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
    const state = { fullness: 10, lastTick: 0 };
    const decayed = applyDecay(state, 60 * 60_000); // an hour
    expect(decayed.fullness).toBe(0);
  });

  it("is a no-op when no time has elapsed and never raises stats on clock skew", () => {
    const state = { fullness: 50, lastTick: 1_000 };
    expect(applyDecay(state, 1_000)).toBe(state);
    expect(applyDecay(state, 0).fullness).toBe(50); // negative elapsed floored at 0
  });
});

describe("feed", () => {
  it("restores fullness, clamped at the max", () => {
    expect(feed({ fullness: 40, lastTick: 0 }).fullness).toBe(40 + FEED_AMOUNT);
    expect(feed({ fullness: 90, lastTick: 0 }).fullness).toBe(100);
  });

  it("does not mutate the input state", () => {
    const state = { fullness: 40, lastTick: 0 };
    feed(state);
    expect(state.fullness).toBe(40);
  });
});
