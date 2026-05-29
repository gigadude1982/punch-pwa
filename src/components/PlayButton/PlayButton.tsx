import type { ButtonHTMLAttributes } from "react";
import styles from "./PlayButton.module.css";

type PlayButtonProps = {
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  ariaLabel?: string;
};

function PlayButton({ onClick, ariaLabel = "Play" }: PlayButtonProps) {
  return (
    <button
      type="button"
      className={styles.playButton}
      onClick={onClick}
      aria-label={ariaLabel}
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
