import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Game } from "./Game";
import { GameProvider } from "../game/GameProvider";
import { STORAGE_KEY } from "../game/storage";
import { BANANA_MAX } from "../game/engine";

/** The game shell as App mounts it once Play is pressed — without the landing flow. */
function renderGame() {
  return render(
    <GameProvider>
      <Game />
    </GameProvider>,
  );
}

function fullnessPct(): number {
  return Number(screen.getByRole("progressbar", { name: /fullness/i }).getAttribute("aria-valuenow"));
}

function happinessPct(): number {
  return Number(
    screen.getByRole("progressbar", { name: /happiness/i }).getAttribute("aria-valuenow"),
  );
}

function seed(fullness: number, happiness = 100, bananas = BANANA_MAX): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ fullness, happiness, bananas, lastTick: Date.now() }),
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("Game", () => {
  it("renders Punch, fullness + happiness meters, and a feed button", () => {
    renderGame();
    expect(screen.getByRole("img", { name: /punch the macaque/i })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /fullness/i })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /happiness/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /feed/i })).toBeInTheDocument();
  });

  it("hydrates both meters from persisted state", () => {
    seed(40, 55);
    renderGame();
    expect(fullnessPct()).toBe(40);
    expect(happinessPct()).toBe(55);
  });

  it("feeding while happy (well-fed) also plays — raising happiness", async () => {
    const user = userEvent.setup();
    seed(100, 40); // full → happy, so a feed press is also a play
    renderGame();
    expect(happinessPct()).toBe(40);
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(happinessPct()).toBeGreaterThan(40); // play restored happiness
  });

  it("feeding while hungry does not raise happiness", async () => {
    const user = userEvent.setup();
    seed(30, 50); // hungry → not happy → feeding is not a play
    renderGame();
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(fullnessPct()).toBe(55); // 30 + FEED_AMOUNT (25)
    expect(happinessPct()).toBeLessThanOrEqual(50); // unchanged (modulo tiny decay)
  });

  it("feeding raises fullness", async () => {
    const user = userEvent.setup();
    seed(40);
    renderGame();
    expect(fullnessPct()).toBe(40);
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(fullnessPct()).toBe(65); // 40 + FEED_AMOUNT (25)
  });

  it("shows the banana stock and spends one per feed", async () => {
    const user = userEvent.setup();
    seed(40, 100, 5);
    renderGame();
    expect(screen.getByText(`🍌 5 / ${BANANA_MAX}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(screen.getByText(`🍌 4 / ${BANANA_MAX}`)).toBeInTheDocument();
  });

  it("disables Feed when out of bananas", () => {
    seed(40, 100, 0);
    renderGame();
    expect(screen.getByText(`🍌 0 / ${BANANA_MAX}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /feed/i })).toBeDisabled();
  });

  it("persists state across a remount", async () => {
    const user = userEvent.setup();
    seed(40);
    const first = renderGame();
    await user.click(screen.getByRole("button", { name: /feed/i }));
    expect(fullnessPct()).toBe(65);
    first.unmount();

    renderGame();
    expect(fullnessPct()).toBe(65); // restored from localStorage (decay over a few ms ≈ 0)
  });
});
