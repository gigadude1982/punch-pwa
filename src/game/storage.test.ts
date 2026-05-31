import { STORAGE_KEY, loadState, saveState } from "./storage";
import { BANANA_MAX } from "./engine";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("round-trips state through localStorage", () => {
    const state = { fullness: 73, happiness: 61, bananas: 4, lastTick: 12_345 };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it("defaults happiness and bananas to full for saves that predate them", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fullness: 50, lastTick: 12_345 }));
    expect(loadState()).toEqual({
      fullness: 50,
      happiness: 100,
      bananas: BANANA_MAX,
      lastTick: 12_345,
    });
  });

  it("returns null when nothing is stored", () => {
    expect(loadState()).toBeNull();
  });

  it("returns null for unparseable JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadState()).toBeNull();
  });

  it("returns null for the wrong shape", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fullness: "lots" }));
    expect(loadState()).toBeNull();
  });
});
