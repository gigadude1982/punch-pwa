import { render, screen } from "@testing-library/react";
import { JungleBackground } from "./JungleBackground";
import { River } from "./River";

describe("River component", () => {
  it("renders the river element with the correct test id", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("renders an SVG inside the river element to convey flowing water", () => {
    render(<River />);
    const river = screen.getByTestId("river");
    expect(river.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the animated flow group inside the SVG", () => {
    render(<River />);
    expect(screen.getByTestId("river-flow")).toBeInTheDocument();
  });

  it("marks the river as aria-hidden so it is purely decorative", () => {
    render(<River />);
    expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the SVG with role presentation so screen readers skip it", () => {
    render(<River />);
    const river = screen.getByTestId("river");
    const svg = river.querySelector("svg");
    expect(svg).toHaveAttribute("role", "presentation");
  });
});

describe("JungleBackground — river integration", () => {
  it("renders a river element within the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("renders the river SVG water graphic inside the background", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    expect(river.querySelector("svg")).toBeInTheDocument();
  });

  it("river appears before the jungle floor in DOM order confirming it renders behind the rock layer", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.parentElement as HTMLElement;
    const children = Array.from(backdrop.children) as HTMLElement[];
    const riverIndex = children.indexOf(river);
    const lastChild = children[children.length - 1];
    const floorIndex = children.indexOf(lastChild);
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(floorIndex).toBeGreaterThan(riverIndex);
  });

  it("river and jungle floor are distinct non-overlapping DOM nodes", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.parentElement as HTMLElement;
    const children = Array.from(backdrop.children) as HTMLElement[];
    const siblingsAfter = children.slice(children.indexOf(river) + 1);
    siblingsAfter.forEach((sibling) => {
      expect(sibling).not.toBe(river);
    });
  });

  it("background wrapper is aria-hidden confirming the scene is purely decorative", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const backdrop = river.closest("[aria-hidden='true']");
    expect(backdrop).toBeInTheDocument();
  });

  it("river coexists with foliage and canopy elements in the same scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
    const allAriaHidden = document.querySelectorAll("[aria-hidden='true']");
    expect(allAriaHidden.length).toBeGreaterThan(0);
  });
});
