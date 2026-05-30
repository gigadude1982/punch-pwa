import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayButton } from "./PlayButton";

describe("PlayButton", () => {
  it("renders a button element with the text 'Play'", () => {
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: /play/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Play");
  });

  it("renders a semantic <button> with type='button' and default aria-label 'Play'", () => {
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: "Play" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-label", "Play");
  });

  it("renders a white media play SVG icon that is hidden from assistive technology", () => {
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: /play/i });
    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    const path = svg!.querySelector("path");
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute("d", "M8 5v14l11-7z");
  });

  it("applies the playButton CSS Modules class to the button element", () => {
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: /play/i });
    expect(button.className).toMatch(/playButton/);
  });

  it("calls onClick when the button is clicked via mouse", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<PlayButton onClick={handleClick} />);
    const button = screen.getByRole("button", { name: /play/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when the button is activated via Enter key", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<PlayButton onClick={handleClick} />);
    const button = screen.getByRole("button", { name: /play/i });
    button.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when the button is activated via Space key", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<PlayButton onClick={handleClick} />);
    const button = screen.getByRole("button", { name: /play/i });
    button.focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when no onClick prop is provided and the button is clicked", async () => {
    const user = userEvent.setup();
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: /play/i });
    await expect(user.click(button)).resolves.not.toThrow();
  });

  it("accepts a custom ariaLabel prop and applies it to the button", () => {
    render(<PlayButton ariaLabel="Start the game" />);
    const button = screen.getByRole("button", { name: "Start the game" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Start the game");
  });

  it("button is keyboard focusable via Tab", async () => {
    const user = userEvent.setup();
    render(<PlayButton />);
    const button = screen.getByRole("button", { name: /play/i });
    await user.tab();
    expect(button).toHaveFocus();
  });
});
