import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { applyDecay, createInitialState, feed as feedPet } from "./engine";
import { loadState, saveState } from "./storage";
import type { PetState } from "./types";

/** How often the pet's stats decay while the app is open. */
const TICK_MS = 5_000;

interface GameContextValue {
  pet: PetState;
  /** Feed the pet, restoring fullness. */
  feed: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function now(): number {
  return Date.now();
}

/**
 * Owns the pet's state: hydrates from localStorage (decayed to the present),
 * persists on every change, and decays on a fixed interval. Player actions are
 * exposed via {@link useGame}. New stats/actions hang off this provider.
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [pet, setPet] = useState<PetState>(() => {
    const saved = loadState();
    return saved ? applyDecay(saved, now()) : createInitialState(now());
  });

  // Persist whenever state changes.
  useEffect(() => {
    saveState(pet);
  }, [pet]);

  // Decay the pet over real time while the app is open.
  useEffect(() => {
    const id = setInterval(() => {
      setPet((prev) => applyDecay(prev, now()));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const feed = useCallback(() => {
    setPet((prev) => feedPet(applyDecay(prev, now())));
  }, []);

  return <GameContext.Provider value={{ pet, feed }}>{children}</GameContext.Provider>;
}

/** Access the game state + actions. Must be used inside a {@link GameProvider}. */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}
