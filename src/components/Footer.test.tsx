import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).__APP_VERSION__;
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version in the format v{version}", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "1.2.3";

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the footer landmark element", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "2.0.0";

      render(<Footer />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("prefixes the version string with v", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "0.9.1";

      render(<Footer />);

      expect(screen.getByTestId("footer-version")).toHaveTextContent("v0.9.1");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("renders no version text", () => {
      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without throwing", () => {
      render(<Footer />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("renders no version text", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "";

      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw when version is empty string", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "";

      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("no network activity during rendering", () => {
    it("does not call fetch when rendering with a version", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "1.0.0";
      const fetchSpy = jest.spyOn(globalThis, "fetch");

      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("does not call fetch when rendering without a version", () => {
      const fetchSpy = jest.spyOn(globalThis, "fetch");

      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
