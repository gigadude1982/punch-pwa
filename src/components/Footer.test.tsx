import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

/**
 * Helper: (re-)define the build-time constant __APP_VERSION__ on globalThis
 * for the duration of a test. Jest runs in jsdom where Vite's `define` plugin
 * never executes, so we inject the value ourselves.
 *
 * Object.defineProperty is used so we can set `undefined` as well as a string,
 * and so repeated calls in the same test file do not throw about redefining a
 * non-configurable property.
 */
function setAppVersion(value: string | undefined): void {
  Object.defineProperty(globalThis, "__APP_VERSION__", {
    value,
    writable: true,
    configurable: true,
  });
}

describe("Footer", () => {
  afterEach(() => {
    setAppVersion(undefined);
  });

  describe("version display", () => {
    it("renders the version in 'v{version}' format when __APP_VERSION__ is a valid semver string", () => {
      setAppVersion("1.2.3");

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the version with 'v' prefix for a different valid version string", () => {
      setAppVersion("0.0.1");

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toHaveTextContent("v0.0.1");
    });

    it("does not render the version element when __APP_VERSION__ is undefined", () => {
      setAppVersion(undefined);

      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw when __APP_VERSION__ is undefined", () => {
      setAppVersion(undefined);

      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("static content", () => {
    it("always renders the copyright notice regardless of version", () => {
      setAppVersion(undefined);

      render(<Footer />);

      expect(screen.getByText(/2026 Punch Tamagotchi/i)).toBeInTheDocument();
    });

    it("always renders the GigaCorp link pointing to gigacorp.co", () => {
      setAppVersion(undefined);

      render(<Footer />);

      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
    });

    it("GigaCorp link opens in a new tab with rel noopener noreferrer", () => {
      setAppVersion(undefined);

      render(<Footer />);

      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("build-time constant — no runtime fetching", () => {
    it("does not call fetch when rendering with a version present", () => {
      const fetchSpy = jest.fn();
      globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

      setAppVersion("2.0.0");
      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("does not call fetch when rendering without a version", () => {
      const fetchSpy = jest.fn();
      globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

      setAppVersion(undefined);
      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
