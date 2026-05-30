import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayButton } from "./PlayButton";

// CSS Modules are mocked by Jest (identity-object-proxy or similar),
// so styles.playButton returns the string "playButton", etc.
// This guards against the class-name mismatch bug described in the spec.

describe("PlayButton", () => {
  describe("Rendering and content", () => {
    it("renders a semantic <button> element", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("displays 'Play' text", () => {
      render(<PlayButton />);
      expect(screen.getByText("Play")).toBeInTheDocument();
    });

    it("has type='button' to prevent accidental form submission", () => {
      render(<PlayButton />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("renders the SVG play icon with aria-hidden so screen readers skip it", () => {
      const { container } = render(<PlayButton />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });

    it("renders the white fill path inside the SVG (media-play triangle)", () => {
      const { container } = render(<PlayButton />);
      const path = container.querySelector("svg path");
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute("d", "M8 5v14l11-7z");
      expect(path).toHaveAttribute("fill", "#ffffff");
    });
  });

  describe("Accessible label", () => {
    it("has the default aria-label 'Play'", () => {
      render(<PlayButton />);
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("accepts a custom ariaLabel prop and applies it", () => {
      render(<PlayButton ariaLabel="Start the game" />);
      expect(screen.getByRole("button", { name: "Start the game" })).toBeInTheDocument();
    });
  });

  describe("CSS Modules class-name alignment (guards the prior mismatch bug)", () => {
    it("applies the 'playButton' CSS Modules class to the <button> element", () => {
      const { container } = render(<PlayButton />);
      const button = container.querySelector("button");
      // identity-object-proxy returns the key as the class name string,
      // so styles.playButton === 'playButton' in the test environment.
      expect(button?.className).toContain("playButton");
    });

    it("applies the 'icon' CSS Modules class to the SVG element", () => {
      const { container } = render(<PlayButton />);
      const svg = container.querySelector("svg");
      expect(svg?.className).toContain("icon");
    });
  });

  describe("Mouse interaction", () => {
    it("calls onClick when the button is clicked", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      await userEvent.click(screen.getByRole("button", { name: "Play" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw when clicked without an onClick prop", async () => {
      render(<PlayButton />);
      await expect(
        userEvent.click(screen.getByRole("button", { name: "Play" })),
      ).resolves.not.toThrow();
    });

    it("calls onClick exactly once per click", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Keyboard interaction", () => {
    it("can be focused via Tab and is included in the tab order", async () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      await userEvent.tab();
      expect(button).toHaveFocus();
    });

    it("activates onClick when Enter is pressed while the button is focused", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates onClick when Space is pressed while the button is focused", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate onClick when an unrelated key is pressed", async () => {
      const handleClick = jest.fn();
      render(<PlayButton onClick={handleClick} />);
      const button = screen.getByRole("button", { name: "Play" });
      button.focus();
      await userEvent.keyboard("{Escape}");
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Hover and active state (fireEvent-based, as jsdom does not apply :hover CSS)", () => {
    it("fires mouseenter and mouseleave without errors", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(() => {
        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);
      }).not.toThrow();
    });

    it("fires mousedown and mouseup without errors (active state simulation)", () => {
      render(<PlayButton />);
      const button = screen.getByRole("button", { name: "Play" });
      expect(() => {
        fireEvent.mouseDown(button);
        fireEvent.mouseUp(button);
      }).not.toThrow();
    });
  });

  describe("Structure / snapshot guard", () => {
    it("matches the expected rendered structure snapshot", () => {
      const { container } = render(<PlayButton />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
