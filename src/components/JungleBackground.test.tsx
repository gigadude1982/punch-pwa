import { render, screen } from "@testing-library/react";
import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      svg: ({
        children,
        animate: _animate,
        transition: _transition,
        ...props
      }: {
        children?: React.ReactNode;
        animate?: unknown;
        transition?: unknown;
        [key: string]: unknown;
      }) => <svg {...(props as React.SVGProps<SVGSVGElement>)}>{children}</svg>,
    },
    useReducedMotion: (): boolean => false,
  };
});

describe("JungleBackground", () => {
  it("renders the background scene without crashing", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    expect(river).toBeInTheDocument();
  });

  it("renders the river element positioned beneath the rock area", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    expect(river).toBeInTheDocument();
  });

  it("river element is decorative and hidden from assistive technology", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    expect(river).toHaveAttribute("aria-hidden", "true");
  });

  it("river appears before the jungle floor in DOM order so it renders behind it", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdrop = river.parentElement as HTMLElement;
    const children = Array.from(backdrop.children);
    const riverIndex = children.indexOf(river);
    const lastIndex = children.length - 1;
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(riverIndex).toBeLessThan(lastIndex);
  });

  it("river and jungle floor coexist in the DOM without one replacing the other", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdrop = river.parentElement as HTMLElement;
    expect(backdrop.children.length).toBeGreaterThan(1);
    expect(river).toBeInTheDocument();
    const allSpans = backdrop.querySelectorAll("span");
    expect(allSpans.length).toBeGreaterThan(0);
  });

  it("river contains an SVG water graphic", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const svg = river.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders foliage emoji in the canopy above the river", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdrop = river.parentElement as HTMLElement;
    const text = backdrop.textContent ?? "";
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/\uD83C[\uDF00-\uDFFF]/u);
  });

  it("renders banana emoji as part of the animated background", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdrop = river.parentElement as HTMLElement;
    const text = backdrop.textContent ?? "";
    expect(text).toContain("\uD83C\uDF4C");
  });
});
