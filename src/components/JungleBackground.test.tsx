import { render, screen } from "@testing-library/react";
import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      svg: ({ children, animate, transition, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) =>
        <svg {...(rest as React.SVGProps<SVGSVGElement>)}>{children}</svg>,
      path: ({ children, animate, transition, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) =>
        <path {...(rest as React.SVGProps<SVGPathElement>)}>{children}</path>,
    },
    useReducedMotion: jest.fn(() => false),
  };
});

describe("JungleBackground", () => {
  it("renders the river element within the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
  });

  it("background scene is decorative and non-interactive", () => {
    const { container } = render(<JungleBackground />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("river contains an SVG element for the wave animation", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    expect(river.querySelector("svg")).toBeInTheDocument();
  });

  it("river appears before the jungle floor in DOM order so it renders behind the rock", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const siblings = Array.from(river.parentElement?.children ?? []);
    const riverIdx = siblings.indexOf(river);
    expect(riverIdx).toBeGreaterThanOrEqual(0);
    expect(riverIdx).toBeLessThan(siblings.length - 1);
  });

  it("river and jungle floor both exist in the DOM without replacing each other", () => {
    const { container } = render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
    expect(container.firstElementChild?.children.length).toBeGreaterThan(1);
  });

  it("river is not the last child of the backdrop so the floor renders above it", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const siblings = Array.from(river.parentElement?.children ?? []);
    const riverIdx = siblings.indexOf(river);
    expect(riverIdx).toBeLessThan(siblings.length - 1);
  });

  it("renders banana and river layers as distinct decorative elements", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
    const bananas = screen.getAllByText("\uD83C\uDF4C");
    expect(bananas.length).toBeGreaterThan(0);
  });
});
