import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

function setAppVersion(value: string | undefined): void {
  Object.defineProperty(globalThis, "__APP_VERSION__", {
    value,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  jest.spyOn(globalThis, "fetch").mockImplementation(() => {
    throw new Error("fetch must not be called during Footer rendering");
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  Object.defineProperty(globalThis, "__APP_VERSION__", {
    value: undefined,
    writable: true,
    configurable: true,
  });
});

describe("Footer", () => {
  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version string in the format 'v{version}'", () => {
      setAppVersion("1.2.3");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders a footer element regardless of version presence", () => {
      setAppVersion("2.0.0");
      render(<Footer />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders correctly for a version with small segments such as 0.0.1", () => {
      setAppVersion("0.0.1");
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v0.0.1");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("does not render any version text", () => {
      setAppVersion(undefined);
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders a footer element without throwing", () => {
      setAppVersion(undefined);
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("does not render any version text", () => {
      setAppVersion("");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("renders without throwing", () => {
      setAppVersion("");
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("no network activity", () => {
    it("does not call fetch when rendering with a valid version", () => {
      setAppVersion("3.1.4");
      expect(() => render(<Footer />)).not.toThrow();
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("does not call fetch when rendering without a version", () => {
      setAppVersion(undefined);
      expect(() => render(<Footer />)).not.toThrow();
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  });
});
