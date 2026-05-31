import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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
    it("renders the footer on the landing page (enablePlay=false)", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the footer on the landing page (enablePlay=true)", () => {
      render(<App enablePlay={true} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the footer after navigating to the game view", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("footer contains copyright text", () => {
      render(<App enablePlay={false} />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveTextContent(/2026 Punch Tamagotchi/i);
    });

    it("footer contains the GigaCorp link", () => {
      render(<App enablePlay={false} />);
      expect(
        screen.getByRole("link", { name: /gigacorp/i }),
      ).toBeInTheDocument();
    });
  });
});
