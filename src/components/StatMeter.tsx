import { clamp } from "../game/engine";
import styles from "./StatMeter.module.css";

interface StatMeterProps {
  label: string;
  value: number;
  max?: number;
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
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
