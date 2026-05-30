/**
 * Tiny synthesized sound effects for Punch — no audio assets, just the Web
 * Audio API. Every function no-ops gracefully where AudioContext is missing
 * (e.g. jsdom under Jest) or before the user has interacted, so callers can
 * fire them from effects without guarding.
 */

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null | undefined;

/** Lazily create (and cache) a shared AudioContext, or null if unsupported. */
function audio(): AudioContext | null {
  if (ctx !== undefined) {
    return ctx;
  }
  if (typeof window === "undefined") {
    ctx = null;
    return ctx;
  }
  const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  ctx = Ctor ? new Ctor() : null;
  return ctx;
}

/** A single oscillator note with an attack/decay gain envelope. */
function note(
  ac: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  start: number,
  duration: number,
  peak = 0.25,
): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** A burst of filtered white noise (for retching / texture). */
function noiseBurst(ac: AudioContext, start: number, duration: number, cutoff: number): void {
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames); // fade out
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(80, cutoff / 4), start + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.4, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(start);
  src.stop(start + duration);
}

/** Resume a suspended context (needed after the first user gesture). */
function ready(): AudioContext | null {
  const ac = audio();
  if (!ac) {
    return null;
  }
  if (ac.state === "suspended") {
    void ac.resume();
  }
  return ac;
}

/** Happy "oo-OOP!" — fires when Punch hits 100% full. */
export function playHoot(): void {
  const ac = ready();
  if (!ac) {
    return;
  }
  const t = ac.currentTime;
  note(ac, "sine", 320, 760, t, 0.14, 0.3);
  note(ac, "sine", 540, 1040, t + 0.13, 0.22, 0.3);
}

/** Distressed monkey screech — fires when the orangutan vanishes (< 25%). */
export function playScream(): void {
  const ac = ready();
  if (!ac) {
    return;
  }
  const t = ac.currentTime;
  note(ac, "sawtooth", 900, 220, t, 0.45, 0.22);
  note(ac, "square", 1300, 500, t + 0.04, 0.3, 0.12);
  noiseBurst(ac, t, 0.35, 2400);
}

/** Wet retch — fires when Punch over-eats and throws up. */
export function playVomit(): void {
  const ac = ready();
  if (!ac) {
    return;
  }
  const t = ac.currentTime;
  note(ac, "sawtooth", 180, 60, t, 0.5, 0.3);
  noiseBurst(ac, t, 0.55, 800);
}
