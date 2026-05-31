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
    it("mounts a footer element on the landing page when enablePlay is false", () => {
      render(<App enablePlay={false} />);
      expect(document.querySelector("footer")).toBeInTheDocument();
    });

    it("mounts a footer element on the landing page when enablePlay is true", () => {
      render(<App enablePlay={true} />);
      expect(document.querySelector("footer")).toBeInTheDocument();
    });

    it("mounts a footer element on the game page after navigating from landing", async () => {
      const user = userEvent.setup();
      render(<App enablePlay={true} />);
      await user.click(screen.getByRole("button", { name: /play/i }));
      await screen.findByRole("button", { name: /feed/i });
      expect(document.querySelector("footer")).toBeInTheDocument();
    });

    it("renders the GigaCorp link inside the footer", () => {
      render(<App enablePlay={false} />);
      expect(screen.getByRole("link", { name: /gigacorp/i })).toBeInTheDocument();
    });

    it("renders copyright text inside the footer", () => {
      render(<App enablePlay={false} />);
      expect(document.querySelector("footer")).toHaveTextContent(/punch tamagotchi/i);
    });

    it("does not throw and omits the version span when __APP_VERSION__ is undefined", () => {
      expect(() => render(<App enablePlay={false} />)).not.toThrow();
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });
});
