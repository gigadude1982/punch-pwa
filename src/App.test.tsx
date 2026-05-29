import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App", () => {
  it("renders the placeholder tagline so the pipeline has something to replace", () => {
    render(<App />);
    expect(screen.getByTestId("placeholder-tagline")).toBeInTheDocument();
  });

  it("renders the Punch heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /punch/i })).toBeInTheDocument();
  });

  it("does not render a 'Coming Soon' button", () => {
    render(<App />);
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /coming soon/i })).not.toBeInTheDocument();
  });

  it("renders a Play button with aria-label='Play'", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("Play button is a native button element", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: "Play" });
    expect(btn.tagName).toBe("BUTTON");
  });
});
