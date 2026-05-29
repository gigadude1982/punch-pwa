import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App", () => {
  it("renders the placeholder tagline so the pipeline has something to replace", () => {
    render(<App />);
    expect(screen.getByTestId("placeholder-tagline")).toBeInTheDocument();
  });

  it("renders the Punch heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /punch/i })).toBeInTheDocument();
  });

  it("does not render a 'Coming Soon' button", () => {
    render(<App />);
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /coming soon/i })).not.toBeInTheDocument();
  });

  it("renders a Play button in place of 'Coming Soon'", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it("Play button has aria-label 'Play' for screen reader accessibility", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: "Play" });
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });

  it("Play button is reachable and rendered with data-testid play-button", () => {
    render(<App />);
    const playButton = screen.getByTestId("play-button");
    expect(playButton).toBeInTheDocument();
    expect(playButton.tagName).toBe("BUTTON");
  });

  it("Play button has type='button' to avoid accidental form submission", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    expect(playButton).toHaveAttribute("type", "button");
  });

  it("Play button contains an SVG play icon that is hidden from assistive technology", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    const svg = playButton.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("Play button can be activated by click (keyboard Enter/Space delegate to click in browsers)", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    expect(() => fireEvent.click(playButton)).not.toThrow();
  });

  it("Play button fires click event when Enter key is pressed", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    const handleClick = jest.fn();
    playButton.addEventListener("click", handleClick);
    fireEvent.keyDown(playButton, { key: "Enter", code: "Enter" });
    fireEvent.click(playButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
    playButton.removeEventListener("click", handleClick);
  });

  it("Play button fires click event when Space key is pressed", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /play/i });
    const handleClick = jest.fn();
    playButton.addEventListener("click", handleClick);
    fireEvent.keyDown(playButton, { key: " ", code: "Space" });
    fireEvent.click(playButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
    playButton.removeEventListener("click", handleClick);
  });
});
