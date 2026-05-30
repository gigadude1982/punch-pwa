import { render, screen } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("renders the Play button with 'Play' text", () => {
    render(<LandingPage />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("renders a button element with the accessible label 'Play'", () => {
    render(<LandingPage />);
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });

  it("renders the media play SVG icon inside the button", () => {
    render(<LandingPage />);
    const button = screen.getByRole("button", { name: /play/i });
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("does not render 'Coming Soon' text", () => {
    render(<LandingPage />);
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it("renders the page heading 'Punch'", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { name: "Punch" })).toBeInTheDocument();
  });
});
