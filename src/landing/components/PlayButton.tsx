import styles from "./PlayButton.module.css";

export type PlayButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

export function PlayButton({ onClick, ariaLabel = "Play" }: PlayButtonProps) {
  return (
    <button type="button" className={styles.playButton} aria-label={ariaLabel} onClick={onClick}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        role="img"
      >
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
      <span className={styles.label}>Play</span>
    </button>
  );
}
