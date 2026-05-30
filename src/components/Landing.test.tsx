import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Landing } from "./Landing";

describe("Landing", () => {
  it("shows the Coming Soon badge and no Play button when play is disabled", () => {
    const onPlay = jest.fn();
    render(<Landing enablePlay={false} onPlay={onPlay} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
  });

  it("shows an accessible Play button when play is enabled", () => {
    render(<Landing enablePlay={true} onPlay={jest.fn()} />);
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it("calls onPlay when the Play button is pressed", async () => {
    const user = userEvent.setup();
    const onPlay = jest.fn();
    render(<Landing enablePlay={true} onPlay={onPlay} />);
    await user.click(screen.getByRole("button", { name: /play/i }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
