import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("renders the Punch heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /punch/i })).toBeInTheDocument();
  });

  it("mounts the game shell", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /feed/i })).toBeInTheDocument();
  });
});
