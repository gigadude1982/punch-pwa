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
});
