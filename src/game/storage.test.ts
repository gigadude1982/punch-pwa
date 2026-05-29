import { STORAGE_KEY, loadState, saveState } from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("round-trips state through localStorage", () => {
    const state = { fullness: 73, lastTick: 12_345 };
    saveState(state);
    expect(loadState()).toEqual(state);
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
