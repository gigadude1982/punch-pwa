import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    beforeEach(() => {
      (global as Record<string, unknown>).__APP_VERSION__ = "1.2.3";
    });

    afterEach(() => {
      delete (global as Record<string, unknown>).__APP_VERSION__;
    });

    it("renders the footer element", () => {
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders the version string in the format v{version}", () => {
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toBeInTheDocument();
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });

    it("does not make any fetch calls during rendering", () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock as unknown as typeof fetch;
      render(<Footer />);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    beforeEach(() => {
      delete (global as Record<string, unknown>).__APP_VERSION__;
    });

    it("renders the footer element without throwing", () => {
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render any version text", () => {
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not make any fetch calls during rendering", () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock as unknown as typeof fetch;
      render(<Footer />);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    beforeEach(() => {
      (global as Record<string, unknown>).__APP_VERSION__ = "";
    });

    afterEach(() => {
      delete (global as Record<string, unknown>).__APP_VERSION__;
    });

    it("renders the footer element without throwing", () => {
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render any version text", () => {
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is a whitespace-only string", () => {
    beforeEach(() => {
      (global as Record<string, unknown>).__APP_VERSION__ = "   ";
    });

    afterEach(() => {
      delete (global as Record<string, unknown>).__APP_VERSION__;
    });

    it("does not render any version text after trimming", () => {
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is a different valid version", () => {
    beforeEach(() => {
      (global as Record<string, unknown>).__APP_VERSION__ = "0.9.0";
    });

    afterEach(() => {
      delete (global as Record<string, unknown>).__APP_VERSION__;
    });

    it("renders v0.9.0 correctly", () => {
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v0.9.0");
    });
  });
});
