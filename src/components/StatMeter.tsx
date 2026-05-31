import { clamp } from "../game/engine";
import styles from "./StatMeter.module.css";

interface StatMeterProps {
  label: string;
  value: number;
  max?: number;
}

/**
 * Map a 0–100 fill to a hue along red → yellow → green, so a low (bad) stat
 * reads red and a full (good) one reads green.
 */
function fillColor(pct: number): string {
  const hue = (pct / 100) * 120; // 0 = red, 60 = yellow, 120 = green
  return `linear-gradient(90deg, hsl(${hue} 70% 40%), hsl(${hue} 75% 50%))`;
}

/** A labelled progress bar for a single 0–max stat. Reused for every stat. */
export function StatMeter({ label, value, max = 100 }: StatMeterProps) {
  const pct = Math.round((clamp(value, 0, max) / max) * 100);
  return (
    <div className={styles.meter}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{pct}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${pct}%`, background: fillColor(pct) }} />
      </div>
    </div>
  );
}
