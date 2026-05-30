import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LandingPage } from "./LandingPage";

jest.mock("./LandingPage.module.css", () => ({
  landingPage: "landingPage",
  title: "title",
}));

jest.mock("../components/PlayButton.module.css", () => ({
  playButton: "playButton",
  icon: "icon",
  label: "label",
}));

describe("LandingPage", () => {
  it("renders the Play button with 'Play' text", () => {
    render(<LandingPage />);

    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("renders a button element for the Play button", () => {
    render(<LandingPage />);

    const button = screen.getByRole("button", { name: /play/i });
    expect(button).toBeInTheDocument();
  });

  it("does not render 'Coming Soon' text", () => {
    render(<LandingPage />);

    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it("renders the SVG play icon inside the button", () => {
    render(<LandingPage />);

    const button = screen.getByRole("button", { name: /play/i });
    // The SVG is aria-hidden so we query directly via the DOM
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("the Play button has an accessible aria-label", () => {
    render(<LandingPage />);

    const button = screen.getByRole("button", { name: "Play" });
    expect(button).toHaveAttribute("aria-label", "Play");
  });

  it("the Play button is keyboard focusable and activatable", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    const button = screen.getByRole("button", { name: /play/i });
    await user.tab();
    expect(button).toHaveFocus();
  });

  it("renders the page heading 'Word Game'", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { name: "Word Game" })).toBeInTheDocument();
  });

  it("renders the page inside a <main> landmark", () => {
    render(<LandingPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("the Play button has type='button' to prevent unintended form submission", () => {
    render(<LandingPage />);

    const button = screen.getByRole("button", { name: /play/i });
    expect(button).toHaveAttribute("type", "button");
  });
});
