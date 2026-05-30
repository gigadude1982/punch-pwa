import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  const originalVersion = (global as Record<string, unknown>).__APP_VERSION__;

  afterEach(() => {
    (global as Record<string, unknown>).__APP_VERSION__ = originalVersion;
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version string prefixed with 'v'", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "1.2.3";
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });

    it("renders the footer element itself", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "1.2.3";
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders the exact text for various semver strings", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "0.0.1";
      const { unmount } = render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v0.0.1");
      unmount();

      (global as Record<string, unknown>).__APP_VERSION__ = "10.20.30";
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v10.20.30");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("does not render any version text", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = undefined;
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without throwing", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = undefined;
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("does not render any version text", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "";
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("renders the footer element without throwing", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "";
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is null", () => {
    it("does not render any version text", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = null;
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("renders the footer element without throwing", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = null;
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("no network activity during rendering", () => {
    it("does not call fetch when rendering with a valid version", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = "1.0.0";
      const fetchSpy = jest.spyOn(global, "fetch");
      render(<Footer />);
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("does not call fetch when rendering without a version", () => {
      (global as Record<string, unknown>).__APP_VERSION__ = undefined;
      const fetchSpy = jest.spyOn(global, "fetch");
      render(<Footer />);
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
