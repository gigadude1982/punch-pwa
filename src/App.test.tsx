import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

jest.mock("framer-motion", () => {
  const React = require("react") as typeof import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {} as Record<string, unknown>,
      {
        get:
          (_target: Record<string, unknown>, prop: string) =>
          ({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }) =>
            React.createElement(prop, rest, children),
      },
    ),
  };
});

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("renders the landing page", () => {
    render(<App enablePlay={false} />);
    expect(screen.getByRole("heading", { name: /punch tamagotchi/i })).toBeInTheDocument();
  });

  describe("when play is disabled (prod / Coming Soon)", () => {
    it("shows Coming Soon and no Play button", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
    });

    it("does not mount the game", () => {
      render(<App enablePlay={false} />);
      expect(screen.queryByRole("button", { name: /feed/i })).not.toBeInTheDocument();
    });
  });

  describe("when play is enabled (dev)", () => {
    it("shows a Play button and no game yet", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /feed/i })).not.toBeInTheDocument();
    });

    it("enters the game when Play is pressed", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      expect(await screen.findByRole("button", { name: /feed/i })).toBeInTheDocument();
    });
  });

  describe("Footer is mounted on every page", () => {
    it("renders the footer landmark on the landing page when enablePlay is false", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the footer landmark on the landing page when enablePlay is true", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the copyright text in the footer on the landing page", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
    });

    it("renders the GigaCorp link in the footer", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });

    it("renders the footer in the game view after Play is clicked", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("does not render a version span when __APP_VERSION__ is undefined in Jest", () => {
      render(<App enablePlay={false} />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });
});
