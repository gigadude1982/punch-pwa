import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { STORAGE_KEY } from "../game/storage";

function fullnessPct(): number {
  return Number(screen.getByRole("progressbar", { name: /fullness/i }).getAttribute("aria-valuenow"));
}

function seed(fullness: number): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ fullness, lastTick: Date.now() }));
}

beforeEach(() => {
  localStorage.clear();
});

describe("Game", () => {
  it("renders Punch, a fullness meter, and a feed button", () => {
    render(<App />);
    expect(screen.getByRole("img", { name: /punch the orangutan/i })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /fullness/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /feed/i })).toBeInTheDocument();
  });

  it("hydrates the meter from persisted state", () => {
    seed(40);
    render(<App />);
    expect(fullnessPct()).toBe(40);
  });

  it("feeding raises fullness", async () => {
    const user = userEvent.setup();
    seed(40);
    render(<App />);
    expect(fullnessPct()).toBe(40);
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(fullnessPct()).toBe(65); // 40 + FEED_AMOUNT (25)
  });

  it("persists state across a remount", async () => {
    const user = userEvent.setup();
    seed(40);
    const first = render(<App />);
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(fullnessPct()).toBe(65);
    first.unmount();

    render(<App />);
    expect(fullnessPct()).toBe(65); // restored from localStorage (decay over a few ms ≈ 0)
  });
});
