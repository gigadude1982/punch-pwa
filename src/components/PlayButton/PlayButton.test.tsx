import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PlayButton from "./PlayButton";

describe("PlayButton", () => {
  describe("Rendering and semantics", () => {
    it("renders a button element with aria-label 'Play' by default", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button).toBeInTheDocument();
    });

    it("renders with a custom ariaLabel when provided", () => {
      render(<PlayButton ariaLabel="Start playback" />);
      const button = screen.getByRole("button", { name: "Start playback" });
      expect(button).toBeInTheDocument();
    });

    it("renders an SVG icon that is hidden from assistive technologies", () => {
      render(<PlayButton />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });

    it("renders the right-pointing triangle path inside the SVG", () => {
      render(<PlayButton />);
      const path = document.querySelector("svg path");
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute("d", "M8 5v14l11-7z");
    });

    it("does NOT render a 'Coming Soon' button", () => {
      render(<PlayButton />);
      expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    });

    it("has type='button' to prevent accidental form submission", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Styling and touch target", () => {
    it("applies the playButton CSS class to the button element", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button.className).toMatch(/playButton/);
    });

    it("applies the icon CSS class to the SVG element", () => {
      render(<PlayButton />);
      const svg = document.querySelector("svg");
      expect(svg!.className.baseVal).toMatch(/icon/);
    });

    it("meets the minimum 44x44 touch target via inline style contract (min-width/min-height in CSS class)", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      // The CSS module sets min-width: 44px and min-height: 44px.
      // In jsdom, computed styles from CSS modules are not applied, so we verify
      // the class is present, which carries the style contract.
      expect(button.className).toMatch(/playButton/);
    });

    it("renders the SVG with explicit width and height attributes for sizing", () => {
      render(<PlayButton />);
      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });

    it("renders the SVG with a viewBox attribute for scalable rendering", () => {
      render(<PlayButton />);
      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("Click interaction", () => {
    it("calls onClick handler when the button is clicked", () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw when clicked without an onClick handler", () => {
      render(<PlayButton />);
      expect(() => {
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
      }).not.toThrow();
    });

    it("passes the mouse event to the onClick handler", () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: "click" }));
    });
  });

  describe("Keyboard interaction", () => {
    it("triggers onClick when the user presses Enter on the focused button", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick when the user presses Space on the focused button", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is reachable via Tab keyboard navigation", async () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      await userEvent.tab();
      expect(button).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("is announced by screen readers using the aria-label attribute", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(button).toHaveAttribute("aria-label", "Play");
    });

    it("does not expose the SVG icon text content to screen readers", () => {
      render(<PlayButton />);
      // The SVG carries aria-hidden='true', so no duplicate label is exposed.
      const svgs = document.querySelectorAll("svg[aria-hidden='true']");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("has data-testid='play-button' for reliable automated selection", () => {
      render(<PlayButton />);
      expect(screen.getByTestId("play-button")).toBeInTheDocument();
    });

    it("data-testid element and role button resolve to the same DOM node", () => {
      render(<PlayButton />);
      const byRole = screen.getByRole("button", { name: "Play" });
      const byTestId = screen.getByTestId("play-button");
      expect(byRole).toBe(byTestId);
    });
  });
});
