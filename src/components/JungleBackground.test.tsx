import { render, screen } from "@testing-library/react";
import { JungleBackground } from "./JungleBackground";

describe("JungleBackground", () => {
  it("renders the river element within the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("jungle-river")).toBeInTheDocument();
  });

  it("renders an SVG inside the river element for the water graphic", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const svg = river.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders the river before the jungle floor in DOM order so the river appears behind it", () => {
    const { container } = render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const backdropChildren = Array.from(container.firstElementChild?.children ?? []);
    const riverIndex = backdropChildren.indexOf(river);
    const jungleFloorIndex = backdropChildren.findIndex((el) =>
      Array.from(el.classList).some((c) => c.includes("jungleFloor")),
    );
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(jungleFloorIndex).toBeGreaterThanOrEqual(0);
    expect(riverIndex).toBeLessThan(jungleFloorIndex);
  });

  it("renders the river as a distinct element from the jungle floor", () => {
    const { container } = render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const jungleFloor = container.querySelector("[class*='jungleFloor']") as HTMLElement | null;
    expect(river).not.toBe(jungleFloor);
    if (jungleFloor !== null) {
      expect(river).not.toContainElement(jungleFloor);
    }
  });

  it("marks the backdrop as aria-hidden for accessibility", () => {
    const { container } = render(<JungleBackground />);
    const backdrop = container.firstElementChild;
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("renders foliage, banana, and tree decorative elements", () => {
    const { container } = render(<JungleBackground />);
    expect(container.textContent).toContain("\uD83C\uDF3F");
    expect(container.textContent).toContain("\uD83C\uDF4C");
    expect(container.textContent).toContain("\uD83C\uDF34");
  });

  it("renders the river SVG with a background rect and wave paths", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("jungle-river");
    const rect = river.querySelector("rect");
    const paths = river.querySelectorAll("path");
    expect(rect).toBeInTheDocument();
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });
});
