import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyDecay,
  createInitialState,
  feed as feedPet,
  isHappy,
  play as playWith,
  recover,
} from "./engine";
import { loadState, saveState } from "./storage";
import type { PetState } from "./types";

/** How often the pet's stats decay while the app is open. */
const TICK_MS = 5_000;
/** How long Punch stays sick after vomiting before he bounces back. */
const SICK_DURATION_MS = 4_000;

interface GameContextValue {
  pet: PetState;
  /** Feed the pet, restoring fullness. While he's happy this also plays with
   *  him (restores happiness) and bumps {@link spinCount}. */
  feed: () => void;
  /** Increments each time Punch plays — the cue for the UI to spin him. */
  spinCount: number;
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
    // sick/overfeed are transient — Punch always wakes up recovered.
    return saved
      ? applyDecay({ ...saved, sick: false, overfeed: 0 }, now())
      : createInitialState(now());
  });

  // Bumped each time a feed lands while Punch is happy, so the UI spins him.
  const [spinCount, setSpinCount] = useState(0);
  const playedRef = useRef(false);

  // Persist whenever state changes.
  useEffect(() => {
    saveState(pet);
  }, [pet]);

  // After a happy feed commits, signal the spin. The count is bumped here (not
  // in the setPet updater) so StrictMode's double-invoked updater can't
  // double-count — the flag it sets is idempotent, this fires once per commit.
  useEffect(() => {
    if (playedRef.current) {
      playedRef.current = false;
      setSpinCount((c) => c + 1);
    }
  }, [pet]);

  // Recover from sickness after a short while.
  useEffect(() => {
    if (!pet.sick) {
      return;
    }
    const id = setTimeout(() => setPet((prev) => recover(prev)), SICK_DURATION_MS);
    return () => clearTimeout(id);
  }, [pet.sick]);

  // Decay the pet over real time while the app is open.
  useEffect(() => {
    const id = setInterval(() => {
      setPet((prev) => applyDecay(prev, now()));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const feed = useCallback(() => {
    setPet((prev) => {
      const decayed = applyDecay(prev, now());
      const happy = isHappy(decayed);
      const fed = feedPet(decayed);
      // `feed` returns the same reference when it's a no-op (sick or out of
      // bananas) — only react to a feed that actually landed.
      const fedLanded = fed !== decayed;
      // A feed landed while he's happy is also a play: he spins and cheers up.
      // (Not if the feed tipped him into sickness from over-eating.)
      if (fedLanded && happy && !fed.sick) {
        playedRef.current = true;
        return playWith(fed);
      }
      return fed;
    });
  }, []);

  return (
    <GameContext.Provider value={{ pet, feed, spinCount }}>{children}</GameContext.Provider>
  );
}

/** Access the game state + actions. Must be used inside a {@link GameProvider}. */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}
