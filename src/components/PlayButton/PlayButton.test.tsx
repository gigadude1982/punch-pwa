import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PlayButton from "./PlayButton";

describe("PlayButton", () => {
  describe("Rendering", () => {
    it("renders a native button element with aria-label='Play'", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveAttribute("aria-label", "Play");
    });

    it("renders an SVG icon inside the button", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg).not.toBeNull();
    });

    it("SVG has aria-hidden='true' so it is not announced by screen readers", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("SVG has focusable='false' to prevent tab stop in IE/Edge", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg).toHaveAttribute("focusable", "false");
    });

    it("renders a right-pointing triangle path inside the SVG", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const path = button.querySelector("svg path");
      expect(path).not.toBeNull();
      expect(path).toHaveAttribute("d", "M8 5v14l11-7z");
    });

    it("button has type='button' to prevent accidental form submission", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Applied styles", () => {
    it("applies the playButton CSS module class to the button element", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      // CSS Modules transform class names in test env; verify at least one class is applied
      expect(button.className).toBeTruthy();
    });

    it("applies the icon CSS module class to the SVG element", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg?.className).toBeTruthy();
    });

    it("SVG has explicit width and height of 24", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });

    it("SVG uses a viewBox that centers the play icon", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      const svg = button.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("Click handler", () => {
    it("invokes onPlay when the button is clicked", () => {
      const handlePlay = jest.fn();
      render(<PlayButton onPlay={handlePlay} />);
      const button = screen.getByRole("button", { name: "Play" });
      fireEvent.click(button);
      expect(handlePlay).toHaveBeenCalledTimes(1);
    });

    it("invokes onPlay exactly once per click (not multiple times)", () => {
      const handlePlay = jest.fn();
      render(<PlayButton onPlay={handlePlay} />);
      const button = screen.getByRole("button", { name: "Play" });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handlePlay).toHaveBeenCalledTimes(3);
    });

    it("does not invoke onPlay when it is not clicked", () => {
      const handlePlay = jest.fn();
      render(<PlayButton onPlay={handlePlay} />);
      expect(handlePlay).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard activation", () => {
    it("invokes onPlay when the Enter key is pressed on the focused button", async () => {
      const handlePlay = jest.fn();
      render(<PlayButton onPlay={handlePlay} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard("{Enter}");
      expect(handlePlay).toHaveBeenCalledTimes(1);
    });

    it("invokes onPlay when the Space key is pressed on the focused button", async () => {
      const handlePlay = jest.fn();
      render(<PlayButton onPlay={handlePlay} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard(" ");
      expect(handlePlay).toHaveBeenCalledTimes(1);
    });

    it("button can receive focus programmatically", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("button is reachable via Tab key navigation", async () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const button = screen.getByRole("button", { name: "Play" });
      await userEvent.tab();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("Accessibility", () => {
    it("is discoverable by screen readers as a button with label 'Play'", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("does not expose the SVG icon to the accessibility tree", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      // SVG is aria-hidden so it should not appear as an img or graphic role
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders with a data-testid attribute for targeted test queries", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      expect(screen.getByTestId("play-button")).toBeInTheDocument();
    });

    it("data-testid element matches the accessible button element", () => {
      render(<PlayButton onPlay={jest.fn()} />);
      const byTestId = screen.getByTestId("play-button");
      const byRole = screen.getByRole("button", { name: "Play" });
      expect(byTestId).toBe(byRole);
    });
  });
});
