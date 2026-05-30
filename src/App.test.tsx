import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Provide the build-time constant that Vite normally replaces at compile time.
// Without this, `__APP_VERSION__` is undefined in the Jest (Node) environment.
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
    it("is present in the rendered output on every page load", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("displays the app version from __APP_VERSION__", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });

    it("is present even when the game view is active", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });
});
