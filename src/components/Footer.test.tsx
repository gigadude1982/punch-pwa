import { render, screen } from "@testing-library/react";

describe("Footer", () => {
  afterEach(() => {
    jest.resetModules();
    delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version in v{version} format", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.2.3";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the correct text for a different version string", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "0.9.0";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v0.9.0");
    });

    it("also renders the copyright and GigaCorp content", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "2.0.0";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByText(/\u00a9 2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("renders no version element and throws no errors", async () => {
      delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders copyright and GigaCorp when version is absent", async () => {
      delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByText(/\u00a9 2026 Punch Tamagotchi/)).toBeInTheDocument();
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

    it("renders without throwing when version is empty string", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "";
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("GigaCorp link attributes", () => {
    it("opens GigaCorp link in a new tab with noopener noreferrer", async () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.0.0";
      const { Footer } = await import("./Footer");
      render(<Footer />);
      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
