import { render, screen } from "@testing-library/react";
import { JungleBackground } from "./JungleBackground";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      g: (props: Record<string, unknown>) => {
        const { children, ...rest } = props;
        return <g {...(rest as React.SVGProps<SVGGElement>)}>{children as React.ReactNode}</g>;
      },
      path: (props: Record<string, unknown>) => {
        const { children, ...rest } = props;
        return <path {...(rest as React.SVGProps<SVGPathElement>)}>{children as React.ReactNode}</path>;
      },
    },
  };
});

describe("JungleBackground", () => {
  it("renders the river element within the background scene", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toBeInTheDocument();
  });

  it("renders both animated wave layers inside the river", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river-wave-back")).toBeInTheDocument();
    expect(screen.getByTestId("river-wave-front")).toBeInTheDocument();
  });

  it("river element is marked aria-hidden as it is decorative and non-interactive", () => {
    render(<JungleBackground />);
    expect(screen.getByTestId("river")).toHaveAttribute("aria-hidden", "true");
  });

  it("river renders before the jungle floor in DOM order so it sits behind the floor and any rock", () => {
    render(<JungleBackground />);
    const river = screen.getByTestId("river");
    const parent = river.parentElement as HTMLElement;
    const children = Array.from(parent.children);
    const riverIndex = children.indexOf(river);
    // river must not be the last child — the jungle floor renders after it
    expect(riverIndex).toBeGreaterThanOrEqual(0);
    expect(riverIndex).toBeLessThan(children.length - 1);
  });

  it("backdrop root element is marked aria-hidden so the whole scene is decorative", () => {
    const { container } = render(<JungleBackground />);
    const backdrop = container.firstElementChild as HTMLElement;
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("river precedes a sibling rock element placed after JungleBackground in the DOM", () => {
    render(
      <div>
        <JungleBackground />
        <div data-testid="punch-rock">rock</div>
      </div>,
    );
    const river = screen.getByTestId("river");
    const rock = screen.getByTestId("punch-rock");
    const position = river.compareDocumentPosition(rock);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders sixteen banana emoji decorations", () => {
    render(<JungleBackground />);
    const bananas = screen.getAllByText("\uD83C\uDF4C");
    expect(bananas).toHaveLength(16);
  });

  it("renders foliage and vine elements in the canopy", () => {
    const { container } = render(<JungleBackground />);
    // 8 vines each have an inline height style
    const vinesWithHeight = Array.from(container.querySelectorAll<HTMLElement>("[style]")).filter(
      (el) => el.style.height !== "",
    );
    expect(vinesWithHeight.length).toBeGreaterThanOrEqual(8);
  });
});
