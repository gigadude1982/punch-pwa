import { render, screen } from "@testing-library/react";
import { River } from "./River";
import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: jest.fn(() => false),
  };
});

import { useReducedMotion } from "framer-motion";

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

beforeEach(() => {
  mockUseReducedMotion.mockReturnValue(false);
});

describe("River component", () => {
  it("renders the river element with the expected test id", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("renders an SVG water graphic inside the river element", () => {
    render(<River />);
    const river = screen.getByTestId("river");
    const svg = river.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("marks the river as aria-hidden so it is decorative and non-interactive", () => {
    render(<River />);
    const river = screen.getByTestId("river");
    expect(river).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the animated flow group element when motion is not reduced", () => {
    mockUseReducedMotion.mockReturnValue(false);
    render(<River />);
    const river = screen.getByTestId("river");
    const flowGroup = river.querySelector("[data-testid='river-flow']");
    expect(flowGroup).toBeInTheDocument();
  });

  it("still renders the river element when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("still renders the SVG when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<River />);
    const river = screen.getByTestId("river");
    expect(river.querySelector("svg")).toBeInTheDocument();
  });

  it("applies a CSS class to the container for stacking order", () => {
    render(<River />);
    const river = screen.getByTestId("river");
    expect(river.className).toBeTruthy();
  });
});

describe("JungleBackground includes the river", () => {
  it("renders a river element within the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("river element contains an SVG in the background scene", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    expect(river.querySelector("svg")).toBeInTheDocument();
  });

  it("river appears before the jungle floor in DOM order confirming lower stacking", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.parentElement as HTMLElement;
    expect(backdrop).not.toBeNull();
    const children = Array.from(backdrop.children);
    const riverIndex = children.indexOf(river);
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(riverIndex).toBeLessThan(children.length - 1);
  });

  it("river is still rendered when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });
});
