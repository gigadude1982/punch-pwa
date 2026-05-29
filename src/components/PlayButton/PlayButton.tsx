import styles from "./PlayButton.module.css";

export interface PlayButtonProps {
  /** Handler invoked when the play button is activated via click or keyboard. */
  onPlay: () => void;
}

function PlayButton({ onPlay }: PlayButtonProps) {
  return (
    <button
      type="button"
      className={styles.playButton}
      aria-label="Play"
      onClick={onPlay}
      data-testid="play-button"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default PlayButton;
