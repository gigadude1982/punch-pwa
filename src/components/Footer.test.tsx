import { render, screen } from "@testing-library/react";

// __APP_VERSION__ is evaluated once at module-load time inside Footer.tsx via a
// `typeof __APP_VERSION__` guard. To exercise different values we must set the
// global BEFORE the module is imported inside each isolated module scope.

afterEach(() => {
  delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  jest.resetModules();
});

describe("Footer", () => {
  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version in 'v{version}' format", () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.2.3";

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the copyright notice alongside the version", () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "2.0.0";

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      render(<Footer />);

      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v2.0.0");
    });

    it("renders the GigaCorp link with the correct href", () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "1.0.0";

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      render(<Footer />);

      const link = screen.getByRole("link", { name: /GigaCorp/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("renders no version element and throws no errors", () => {
      // __APP_VERSION__ is intentionally absent from globalThis here.

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders copyright and GigaCorp link when version is absent", () => {
      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      render(<Footer />);

      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /GigaCorp/i })).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("omits the version element entirely", () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "";

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw when __APP_VERSION__ is an empty string", () => {
      (globalThis as Record<string, unknown>)["__APP_VERSION__"] = "";

      let Footer!: () => JSX.Element;
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ Footer } = require("./Footer") as { Footer: () => JSX.Element });
      });

      expect(() => render(<Footer />)).not.toThrow();
    });
  });
});
