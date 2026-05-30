import styles from "./PlayButton.module.css";

type PlayButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

export const PlayButton = ({ onClick, ariaLabel = "Play" }: PlayButtonProps) => {
  return (
    <button type="button" className={styles.playButton} onClick={onClick} aria-label={ariaLabel}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        role="img"
      >
        <path d="M8 5v14l11-7z" fill="#ffffff" />
      </svg>
      <span className={styles.label}>Play</span>
    </button>
  );
};
