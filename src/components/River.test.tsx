import { render, screen } from "@testing-library/react";
import { River } from "./River";

describe("River", () => {
  describe("element presence and visibility", () => {
    it("renders the river container element", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("renders the SVG water element inside the river container", () => {
      const { container } = render(<River />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders both flowing-water wave layers to convey movement", () => {
      render(<River />);
      expect(screen.getByTestId("river-wave-back")).toBeInTheDocument();
      expect(screen.getByTestId("river-wave-front")).toBeInTheDocument();
    });

    it("wave layers are distinct elements", () => {
      render(<River />);
      const waveBack = screen.getByTestId("river-wave-back");
      const waveFront = screen.getByTestId("river-wave-front");
      expect(waveBack).not.toBe(waveFront);
    });
  });

  describe("accessibility and interactivity", () => {
    it("is marked aria-hidden to keep it out of the accessibility tree", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
    });

    it("does not render any interactive elements (purely decorative)", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      const interactive = river.querySelectorAll(
        "button, a, input, select, textarea, [role='button'], [tabindex]",
      );
      expect(interactive).toHaveLength(0);
    });
  });

  describe("z-index and render order relative to rock", () => {
    it("renders behind a sibling rock element when ordered before it in the DOM", () => {
      render(
        <div>
          <River />
          <div data-testid="rock">rock</div>
        </div>,
      );

      const river = screen.getByTestId("river");
      const rock = screen.getByTestId("rock");

      expect(river).not.toBe(rock);
      expect(
        river.compareDocumentPosition(rock) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("applies the river CSS class that carries the low z-index styling", () => {
      render(<River />);
      const river = screen.getByTestId("river");
      expect(river.className).toMatch(/river/);
    });

    it("river element is a distinct element separate from any rock sibling", () => {
      render(
        <div>
          <River />
          <div data-testid="rock" className="rock">rock</div>
        </div>,
      );
      const river = screen.getByTestId("river");
      const rock = screen.getByTestId("rock");
      expect(river.contains(rock)).toBe(false);
      expect(rock.contains(river)).toBe(false);
    });
  });

  describe("SVG structure and wave paths", () => {
    it("SVG uses preserveAspectRatio none for full-bleed stretching", () => {
      const { container } = render(<River />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("preserveAspectRatio", "none");
    });

    it("renders a base rect element for the river bed fill", () => {
      const { container } = render(<River />);
      const rect = container.querySelector("rect");
      expect(rect).toBeInTheDocument();
    });

    it("each wave layer contains a path element defining the wave shape", () => {
      render(<River />);
      const waveBack = screen.getByTestId("river-wave-back");
      const waveFront = screen.getByTestId("river-wave-front");
      expect(waveBack.querySelector("path")).toBeInTheDocument();
      expect(waveFront.querySelector("path")).toBeInTheDocument();
    });

    it("the two wave path elements are distinct nodes", () => {
      render(<River />);
      const waveBack = screen.getByTestId("river-wave-back");
      const waveFront = screen.getByTestId("river-wave-front");
      const pathBack = waveBack.querySelector("path");
      const pathFront = waveFront.querySelector("path");
      expect(pathBack).not.toBe(pathFront);
    });
  });

  describe("prefers-reduced-motion compatibility", () => {
    beforeEach(() => {
      const mediaQueryList = {
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(() => true),
      };
      globalThis.matchMedia = jest.fn().mockReturnValue(mediaQueryList) as typeof globalThis.matchMedia;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("still renders the river element when prefers-reduced-motion is active", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });

    it("still renders both wave layers when prefers-reduced-motion is active", () => {
      render(<River />);
      expect(screen.getByTestId("river-wave-back")).toBeInTheDocument();
      expect(screen.getByTestId("river-wave-front")).toBeInTheDocument();
    });

    it("remains aria-hidden when prefers-reduced-motion is active", () => {
      render(<River />);
      expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("scene composition ordering", () => {
    it("renders the river before the jungle floor sibling confirming behind ordering", () => {
      render(
        <div>
          <River />
          <div data-testid="jungle-floor">jungle floor</div>
        </div>,
      );
      const river = screen.getByTestId("river");
      const floor = screen.getByTestId("jungle-floor");
      expect(
        river.compareDocumentPosition(floor) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("does not prevent sibling elements from rendering above it", () => {
      render(
        <div>
          <River />
          <div data-testid="above-content">above</div>
        </div>,
      );
      expect(screen.getByTestId("above-content")).toBeInTheDocument();
      expect(screen.getByTestId("river")).toBeInTheDocument();
    });
  });
});
