import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

declare const __APP_VERSION__: string;

const renderFooter = async () => {
  const { Footer } = await import("./Footer");
  return render(<Footer />);
};

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).__APP_VERSION__;
});

describe("Footer", () => {
  describe("when __APP_VERSION__ is a truthy string", () => {
    it("renders the version as 'v{version}' (e.g. 'v1.2.3')", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "1.2.3";

      await renderFooter();

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the 'v' prefix immediately before the version number", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "2.0.0";

      await renderFooter();

      expect(screen.getByTestId("footer-version").textContent).toBe("v2.0.0");
    });

    it("renders a footer landmark element", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "0.1.0";

      await renderFooter();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("omits version text and throws no error", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = undefined;

      await renderFooter();

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without crashing", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = undefined;

      await renderFooter();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("omits version text when version is empty", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "";

      await renderFooter();

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer element without crashing when version is empty", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "";

      await renderFooter();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("network behaviour", () => {
    it("renders without making any network requests", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__APP_VERSION__ = "1.0.0";

      const fetchSpy = jest.spyOn(globalThis, "fetch");

      await renderFooter();

      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });
});
