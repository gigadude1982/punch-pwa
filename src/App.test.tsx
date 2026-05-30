import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Provide the build-time constant that Vite normally injects at compile time.
// The Footer component uses `typeof __APP_VERSION__` which won't throw even if
// the global is absent, but setting it here lets us assert the version text too.
(globalThis as Record<string, unknown>).__APP_VERSION__ = "1.2.3";

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

  describe("Footer", () => {
    it("is mounted and present in the rendered App output on page load", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("displays the version string injected at build time", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });

    it("is present in the rendered App output when play is enabled", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("is still present after navigating into the game", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("omits the version span when __APP_VERSION__ is not set", () => {
      const original = (globalThis as Record<string, unknown>).__APP_VERSION__;
      (globalThis as Record<string, unknown>).__APP_VERSION__ = undefined;
      render(<App enablePlay={false} />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
      (globalThis as Record<string, unknown>).__APP_VERSION__ = original;
    });
  });
});
