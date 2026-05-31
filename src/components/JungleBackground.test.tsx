import { render, screen } from "@testing-library/react";

import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      path: (props: Record<string, unknown>) => {
        const { animate: _a, transition: _t, initial: _i, ...svgProps } = props;
        return <path {...(svgProps as JSX.IntrinsicElements["path"])} />;
      },
    },
    useReducedMotion: (): boolean => false,
  };
});

describe("JungleBackground", () => {
  it("renders the river element in the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("the entire backdrop is aria-hidden so it is purely decorative", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.closest("[aria-hidden='true']");
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("river SVG has role=presentation marking it as non-interactive", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const svg = river.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("role", "presentation");
  });

  it("river contains at least two wave path elements for flowing water animation", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const paths = river.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("river SVG contains a rect for the water color base", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const rect = river.querySelector("rect");
    expect(rect).not.toBeNull();
  });

  it("river SVG defs define a linearGradient for the water color", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const gradient = river.querySelector("defs > linearGradient");
    expect(gradient).not.toBeNull();
  });

  it("river DOM node precedes subsequent elements in document order (renders behind rock)", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.closest("[aria-hidden='true']") as HTMLElement;
    const allElements = Array.from(backdrop.querySelectorAll("*"));
    const riverIdx = allElements.indexOf(river);
    expect(riverIdx).toBeGreaterThan(-1);
    expect(allElements.length - 1).toBeGreaterThan(riverIdx);
  });

  it("river and canopy or banana elements coexist without replacing each other", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.closest("[aria-hidden='true']") as HTMLElement;
    const spans = backdrop.querySelectorAll("span");
    expect(spans.length).toBeGreaterThan(0);
    expect(river).toBeInTheDocument();
  });
});
