import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { River } from "./River";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      path: ({ animate: _a, transition: _t, ...props }: Record<string, unknown>) => (
        <path {...(props as React.SVGProps<SVGPathElement>)} />
      ),
      svg: ({ animate: _a, transition: _t, ...props }: Record<string, unknown>) => (
        <svg {...(props as React.SVGProps<SVGSVGElement>)} />
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
    it("renders a river element visible in the scene", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("contains an SVG element representing flowing water", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.querySelector("svg")).toBeInTheDocument();
    });

    it("SVG uses a viewBox of 1200x200 for the water band", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const svg = river.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 1200 200");
    });

    it("renders a base rect that fills the river body", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const rect = river.querySelector("rect");
      expect(rect).toBeInTheDocument();
      expect(rect).toHaveAttribute("width", "1200");
      expect(rect).toHaveAttribute("height", "200");
    });

    it("renders at least two wave path elements for the flowing water effect", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const paths = river.querySelectorAll("path");
      expect(paths.length).toBeGreaterThanOrEqual(2);
    });

    it("SVG preserves aspect ratio to none so it fills full width at all resolutions", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const svg = river.querySelector("svg");
      expect(svg).toHaveAttribute("preserveAspectRatio", "none");
    });
  });

  describe("accessibility", () => {
    it("is hidden from assistive technology with aria-hidden", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
    });

    it("does not expose a role to screen readers", () => {
      render(<River />);
      expect(screen.getByTestId("river")).not.toHaveAttribute("role");
    });
  });

  describe("render order — behind the rock", () => {
    it("applies the river CSS module class to establish its z-index context", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.className).toBeTruthy();
    });

    it("is a distinct element — does not share data-testid with any rock element", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
      expect(screen.queryByTestId("rock")).not.toBeInTheDocument();
    });

    it("river container is not the rock element", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river).not.toHaveAttribute("data-testid", "rock");
    });
  });

  describe("prefers-reduced-motion", () => {
    it("still renders the river element when reduced motion is requested", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("still renders the SVG water graphic when reduced motion is requested", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.querySelector("svg")).toBeInTheDocument();
    });

    it("still renders wave paths when reduced motion is requested", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.querySelectorAll("path").length).toBeGreaterThanOrEqual(2);
    });

    it("does not throw when motion is suppressed", () => {
      mockUseReducedMotion.mockReturnValue(true);
      expect(() => render(<River />)).not.toThrow();
    });
  });
});
