import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { River } from "./River";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      path: ({
        children,
        animate: _animate,
        transition: _transition,
        ...rest
      }: React.SVGProps<SVGPathElement> & { animate?: unknown; transition?: unknown }) => (
        <path {...rest}>{children}</path>
      ),
    },
    useReducedMotion: jest.fn(() => false),
  };
});

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

describe("River", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the river element with the correct test id", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("renders an inline SVG water graphic inside the river container", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.querySelector("svg")).toBeInTheDocument();
    });

    it("is decorative and aria-hidden so screen readers skip it", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("visual distinctness from rock", () => {
    it("does not render an element with testid 'rock'", () => {
      render(<River />);
      expect(screen.queryByTestId("rock")).not.toBeInTheDocument();
    });

    it("applies the river CSS class to the container for z-index ordering", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.className).toBeTruthy();
    });

    it("applies a class to the SVG element", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const svg = river.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg!.className).toBeTruthy();
    });
  });

  describe("z-index / render order (behind-rock)", () => {
    it("container has a non-empty class attribute carrying the lower z-index style", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river).toHaveAttribute("class");
      expect(river.getAttribute("class")).not.toBe("");
    });
  });

  describe("prefers-reduced-motion", () => {
    it("still renders the river element when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("still renders the SVG graphic when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.querySelector("svg")).toBeInTheDocument();
    });

    it("still marks the element aria-hidden when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
    });

    it("does not throw when animation is disabled via reduced motion", () => {
      mockUseReducedMotion.mockReturnValue(true);
      expect(() => render(<River />)).not.toThrow();
    });
  });
});
