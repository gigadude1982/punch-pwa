import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Reset the __APP_VERSION__ global between tests.
 * Under Jest (no Vite transform) the bare identifier `__APP_VERSION__` resolves
 * to the same global property we set here via the bracket notation, because
 * `typeof __APP_VERSION__` evaluates the undeclared identifier safely through
 * the `typeof` operator without throwing a ReferenceError.
 */
function setAppVersion(value: string | undefined): void {
  if (value === undefined) {
    delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  } else {
    (globalThis as Record<string, unknown>)["__APP_VERSION__"] = value;
  }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("Footer", () => {
  afterEach(() => {
    // Always clean up the global after each test so tests are fully isolated.
    delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  });

  // -------------------------------------------------------------------------
  // Happy path: valid version string
  // -------------------------------------------------------------------------

  describe("when __APP_VERSION__ is a valid version string", () => {
    it("renders the version in v{version} format", () => {
      setAppVersion("1.2.3");
      render(<Footer />);

      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the exact version injected via the constant", () => {
      setAppVersion("0.9.0");
      render(<Footer />);

      expect(screen.getByTestId("footer-version")).toHaveTextContent("v0.9.0");
    });

    it("renders the version span alongside the copyright and GigaCorp credit", () => {
      setAppVersion("2.0.1");
      render(<Footer />);

      // Static footer content still present.
      expect(screen.getByText(/© 2026 Punch Tamagotchi/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
      // Version element is also present.
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v2.0.1");
    });
  });

  // -------------------------------------------------------------------------
  // Graceful degradation: version absent / undefined
  // -------------------------------------------------------------------------

  describe("when __APP_VERSION__ is undefined", () => {
    it("does not render any version text", () => {
      setAppVersion(undefined);
      render(<Footer />);

      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("does not throw and still renders the rest of the footer", () => {
      setAppVersion(undefined);

      expect(() => render(<Footer />)).not.toThrow();

      expect(screen.getByText(/© 2026 Punch Tamagotchi/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });

    it("does not render any text starting with 'v' in the footer", () => {
      setAppVersion(undefined);
      const { container } = render(<Footer />);

      // Ensure there is no element whose text content matches the version pattern.
      const footer = container.querySelector("footer");
      expect(footer).not.toBeNull();
      // No child span should carry a version-like label.
      const spans = Array.from(footer!.querySelectorAll("span"));
      const versionSpan = spans.find((el) => /^v\d/.test(el.textContent ?? ""));
      expect(versionSpan).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Build-time constant (no runtime requests)
  // -------------------------------------------------------------------------

  describe("build-time constant — no runtime requests", () => {
    it("does not trigger any fetch or XHR calls when rendering", () => {
      setAppVersion("3.1.4");

      const fetchSpy = jest.fn();
      // Assign a mock fetch to detect any attempted runtime network call.
      globalThis.fetch = fetchSpy as jest.Mock;

      render(<Footer />);

      expect(fetchSpy).not.toHaveBeenCalled();

      // Restore: remove the mock so it does not pollute other tests.
      delete (globalThis as Record<string, unknown>)["fetch"];
    });

    it("reads the version synchronously during render without async side-effects", async () => {
      setAppVersion("4.5.6");
      render(<Footer />);

      // The version element is immediately present — no deferred resolution.
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v4.5.6");
    });
  });

  // -------------------------------------------------------------------------
  // Static footer content always present
  // -------------------------------------------------------------------------

  describe("static footer content", () => {
    it("renders the GigaCorp link with correct href regardless of version", () => {
      setAppVersion("1.0.0");
      render(<Footer />);

      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders the copyright notice", () => {
      setAppVersion(undefined);
      render(<Footer />);

      expect(screen.getByText(/© 2026 Punch Tamagotchi/i)).toBeInTheDocument();
    });
  });
});
