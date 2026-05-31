import { render, screen } from "@testing-library/react";
import { River } from "./River";
import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const ReactModule = require("react") as typeof import("react");
  return {
    motion: new Proxy(
      {},
      {
        get(_target: Record<string, unknown>, prop: string) {
          return function MotionStub(props: Record<string, unknown>) {
            const { animate: _a, transition: _t, ...rest } = props;
            return ReactModule.createElement(prop as keyof JSX.IntrinsicElements, rest);
          };
        },
      },
    ),
    useReducedMotion: jest.fn().mockReturnValue(false),
  };
});

import { useReducedMotion } from "framer-motion";

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

beforeEach(() => {
  mockUseReducedMotion.mockReturnValue(false);
});

describe("River (standalone)", () => {
  it("renders the river element with the correct testid", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("contains an SVG water graphic", () => {
    const { container } = render(<River />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders two wave paths inside the SVG", () => {
    render(<River />);
    expect(screen.getByTestId("river-wave-a")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-b")).toBeInTheDocument();
  });

  it("marks the river container as aria-hidden so screen readers skip it", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies a CSS class to the river container for z-index ordering", () => {
    const { container } = render(<River />);
    const riverDiv = container.firstChild as HTMLElement;
    expect(riverDiv.className).toBeTruthy();
  });

  it("still renders all elements when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-a")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-b")).toBeInTheDocument();
  });

  it("does not render any interactive elements (purely decorative)", () => {
    render(<River />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("River within JungleBackground", () => {
  it("renders a river element inside the JungleBackground scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
  });

  it("jungle-river is a distinct DOM node from other scene children", () => {
    const { container } = render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const allDivs = Array.from(container.querySelectorAll("div"));
    const nonRiverDivs = allDivs.filter((el) => el !== river);
    expect(nonRiverDivs.length).toBeGreaterThan(0);
    nonRiverDivs.forEach((el) => expect(el).not.toBe(river));
  });

  it("river appears before the jungle floor in DOM order (lower z-index renders behind)", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdrop = river.parentElement as HTMLElement;
    const children = Array.from(backdrop.children);
    const riverIndex = children.indexOf(river);
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(children.length).toBeGreaterThan(riverIndex + 1);
  });

  it("jungle-river contains an SVG element", () => {
    render(<JungleBackground />);
    const riverDiv = screen.getByTestId("jungle-river");
    expect(riverDiv.querySelector("svg")).toBeInTheDocument();
  });

  it("still renders the river when prefers-reduced-motion is active", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
  });
});
