import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import pkg from "../../package.json";

declare const __APP_VERSION__: string | undefined;

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

    it("renders the version from package.json with a 'v' prefix", () => {
      setAppVersion(pkg.version);

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toHaveTextContent(`v${pkg.version}`);
    });

    it("reads version 1.0.2 from package.json", () => {
      expect(pkg.version).toBe("1.0.2");
    });

    it("renders 'v1.0.2' in the footer when __APP_VERSION__ is set to 1.0.2", () => {
      setAppVersion("1.0.2");

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toHaveTextContent("v1.0.2");
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

  describe("build-time constant - no runtime fetching", () => {
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
