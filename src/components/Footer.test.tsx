import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

const setAppVersion = (value: string | undefined) => {
  Object.defineProperty(globalThis, "__APP_VERSION__", {
    configurable: true,
    writable: true,
    value,
  });
};

afterEach(() => {
  setAppVersion(undefined);
  jest.restoreAllMocks();
});

describe("Footer", () => {
  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders 'v{version}' in the footer", () => {
      setAppVersion("1.2.3");
      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the footer element", () => {
      setAppVersion("1.2.3");
      render(<Footer />);

      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("trims whitespace from the version before rendering", () => {
      setAppVersion("  2.0.0  ");
      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toHaveTextContent("v2.0.0");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("renders the footer without any version text", () => {
      setAppVersion(undefined);
      render(<Footer />);

      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw during render", () => {
      setAppVersion(undefined);
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("renders the footer without any version text", () => {
      setAppVersion("");
      render(<Footer />);

      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw during render", () => {
      setAppVersion("");
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("when __APP_VERSION__ is a whitespace-only string", () => {
    it("renders no version text after trimming", () => {
      setAppVersion("   ");
      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("no network activity", () => {
    it("does not call fetch during rendering when version is present", () => {
      const fetchSpy = jest.spyOn(globalThis, "fetch");
      setAppVersion("3.0.0");
      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("does not call fetch during rendering when version is absent", () => {
      const fetchSpy = jest.spyOn(globalThis, "fetch");
      setAppVersion(undefined);
      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
