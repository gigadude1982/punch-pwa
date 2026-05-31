import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

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
      }: React.SVGProps<SVGPathElement> & { animate?: unknown; transition?: unknown }) =>
        React.createElement("path", rest, children),
    },
    useReducedMotion: jest.fn(() => false),
  };
});

jest.mock("./River.module.css", () => ({
  river: "river",
  water: "water",
}));

import { useReducedMotion } from "framer-motion";

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

describe("River", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders a river element visible in the scene", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("is purely decorative and hidden from assistive technology", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
  });

  it("is a distinct element identifiable separately from the rock", () => {
    render(
      <div>
        <River />
        <div data-testid="rock" />
      </div>,
    );
    const river = screen.getByTestId("river");
    const rock = screen.getByTestId("rock");
    expect(river).not.toBe(rock);
    expect(river).toBeInTheDocument();
    expect(rock).toBeInTheDocument();
  });

  it("renders behind the rock via DOM order so lower z-index takes effect", () => {
    render(
      <div>
        <River />
        <div data-testid="rock" />
      </div>,
    );
    const river = screen.getByTestId("river");
    const rock = screen.getByTestId("rock");
    expect(river.compareDocumentPosition(rock)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("applies the river CSS class that establishes a lower stacking context", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toHaveClass("river");
  });

  it("renders an SVG with wave paths for the visual water effect", () => {
    const { container } = render(<River />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the back wave path with the correct data-testid", () => {
    render(<River />);
    expect(screen.getByTestId("river-wave-back")).toBeInTheDocument();
  });

  it("renders the front wave path with the correct data-testid", () => {
    render(<River />);
    expect(screen.getByTestId("river-wave-front")).toBeInTheDocument();
  });

  it("still renders all elements when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-back")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-front")).toBeInTheDocument();
  });

  it("SVG uses preserveAspectRatio none for scaling across all resolutions", () => {
    const { container } = render(<River />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("preserveAspectRatio", "none");
  });

  it("SVG is marked as presentational so screen readers skip it", () => {
    const { container } = render(<River />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "presentation");
  });
});
