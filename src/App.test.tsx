import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Vite replaces __APP_VERSION__ at build time; Jest does not run Vite, so we
// must assign it as a global here to prevent a ReferenceError at runtime.
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

  describe("Footer integration", () => {
    it("mounts the Footer so it is present on every page load with play disabled", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("mounts the Footer so it is present on every page load with play enabled", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("displays the version string from __APP_VERSION__ in the footer", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });
  });
});
