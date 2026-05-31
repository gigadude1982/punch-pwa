import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeAll(() => {
  (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
    "1.2.3";
});

afterAll(() => {
  (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
    undefined;
});

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("renders the landing page", () => {
    render(<App enablePlay={false} />);
    expect(screen.getByRole("heading", { name: /punch tamagotchi/i })).toBeInTheDocument();
  });

  describe("when play is disabled (prod / Coming Soon)", () => {
    it("shows Coming Soon and no Play button", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
    });

    it("does not mount the game", () => {
      render(<App enablePlay={false} />);
      expect(screen.queryByRole("button", { name: /feed/i })).not.toBeInTheDocument();
    });
  });

  describe("when play is enabled (dev)", () => {
    it("shows a Play button and no game yet", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /feed/i })).not.toBeInTheDocument();
    });

    it("enters the game when Play is pressed", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      expect(await screen.findByRole("button", { name: /feed/i })).toBeInTheDocument();
    });
  });

  describe("Footer visibility", () => {
    it("renders a footer element on the landing page when enablePlay is false", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders a footer element on the landing page when enablePlay is true", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("displays the version string in the footer when __APP_VERSION__ is set", () => {
      render(<App enablePlay={false} />);
      const versionEl = screen.getByTestId("footer-version");
      expect(versionEl).toBeInTheDocument();
      expect(versionEl).toHaveTextContent("v1.2.3");
    });

    it("footer contains GigaCorp credit link", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });

    it("footer contains copyright text", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("contentinfo")).toHaveTextContent(/2026 Punch Tamagotchi/i);
    });

    it("footer is visible in the game view after Play is pressed", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("does not render the version span when __APP_VERSION__ is undefined", () => {
      (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
        undefined;
      render(<App enablePlay={false} />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
      (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
        "1.2.3";
    });

    it("does not render the version span when __APP_VERSION__ is an empty string", () => {
      (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
        "";
      render(<App enablePlay={false} />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
      (globalThis as typeof globalThis & { __APP_VERSION__: string | undefined }).__APP_VERSION__ =
        "1.2.3";
    });
  });
});
