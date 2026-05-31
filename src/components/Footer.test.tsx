import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

// Store the original descriptor so we can restore it after each test
const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "__APP_VERSION__");

function defineAppVersion(value: string | undefined): void {
  Object.defineProperty(globalThis, "__APP_VERSION__", {
    value,
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  // Restore original global state
  if (originalDescriptor) {
    Object.defineProperty(globalThis, "__APP_VERSION__", originalDescriptor);
  } else {
    // If it never existed, delete the property
    delete (globalThis as Record<string, unknown>)["__APP_VERSION__"];
  }
});

describe("Footer", () => {
  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    it("renders the version in 'v{version}' format", () => {
      defineAppVersion("1.2.3");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("renders the version element with a leading 'v' prefix", () => {
      defineAppVersion("0.0.1");
      render(<Footer />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl.textContent).toBe("v0.0.1");
    });

    it("renders copyright and GigaCorp text alongside the version", () => {
      defineAppVersion("2.0.0");
      render(<Footer />);
      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
      expect(screen.getByTestId("footer-version")).toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    it("does not render a version element", () => {
      defineAppVersion(undefined);
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer with copyright and GigaCorp text", () => {
      defineAppVersion(undefined);
      render(<Footer />);
      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });

    it("throws no JavaScript errors when version is undefined", () => {
      defineAppVersion(undefined);
      expect(() => render(<Footer />)).not.toThrow();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    it("does not render a version element", () => {
      defineAppVersion("");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });

    it("still renders the footer without errors", () => {
      defineAppVersion("");
      expect(() => render(<Footer />)).not.toThrow();
    });

    it("still renders copyright and GigaCorp text when version is empty", () => {
      defineAppVersion("");
      render(<Footer />);
      expect(screen.getByText(/2026 Punch Tamagotchi/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });
  });

  describe("footer static content", () => {
    it("renders a GigaCorp link pointing to gigacorp.co", () => {
      defineAppVersion("1.0.0");
      render(<Footer />);
      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("href", "https://www.gigacorp.co");
    });

    it("opens the GigaCorp link in a new tab with rel noopener noreferrer", () => {
      defineAppVersion("1.0.0");
      render(<Footer />);
      const link = screen.getByRole("link", { name: /gigacorp/i });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
