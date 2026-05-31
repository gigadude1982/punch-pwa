import { render, screen } from "@testing-library/react";

/**
 * __APP_VERSION__ is a compile-time constant replaced by Vite's `define`.
 * In Jest (no Vite processing) the bare identifier is not substituted, so we
 * control it by setting it on `globalThis` before each isolated module load.
 *
 * We re-import Footer dynamically inside each test group so the module
 * captures whatever value globalThis.__APP_VERSION__ holds at import time.
 */

describe("Footer", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version in 'v{version}' format", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.2.3";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders version text that starts with 'v' prefix", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "3.0.0";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl.textContent).toBe("v3.0.0");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("renders no version element and throws no errors", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = undefined;
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the copyright and GigaCorp spans", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = undefined;
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("omits the version element", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("renders without errors when version is empty string", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "";
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("static footer content", () => {
    it("always renders the GigaCorp link with correct attributes", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.0.0";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("always renders the copyright notice", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = undefined;
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByText(/\u00a9 2026 Punch Tamagotchi/)).toBeInTheDocument();
    });
  });
});
