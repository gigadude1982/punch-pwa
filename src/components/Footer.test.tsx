import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

declare const __APP_VERSION__: string;

describe("Footer", () => {
  const originalVersion = (globalThis as Record<string, unknown>).__APP_VERSION__;

  afterEach(() => {
    (globalThis as Record<string, unknown>).__APP_VERSION__ = originalVersion;
  });

  describe("when __APP_VERSION__ is a truthy string", () => {
    it("renders the footer element", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "1.2.3";
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("displays the version in 'v{version}' format", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "1.2.3";
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });

    it("prefixes the version with 'v' exactly once", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "0.9.0";
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl.textContent).toBe("v0.9.0");
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("does not render the version span", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "";
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without throwing", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "";
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("does not render the version span", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = undefined;
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without throwing", () => {
      (globalThis as Record<string, unknown>).__APP_VERSION__ = undefined;
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("network requests", () => {
    it("makes no fetch calls when rendering", () => {
      const fetchSpy = jest.spyOn(globalThis, "fetch");
      (globalThis as Record<string, unknown>).__APP_VERSION__ = "2.0.0";
      render(<Footer />);
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
