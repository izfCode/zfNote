import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastHost } from "../../src/components/ToastHost";
import { useToasts } from "../../src/hooks/useToasts";
import { vi } from "vitest";

function Harness() {
  const { toasts, toast } = useToasts();
  return (
    <div>
      <button data-testid="add" onClick={() => toast("hi", "✓", "success")}>add</button>
      <ToastHost toasts={toasts} />
    </div>
  );
}

describe("ToastHost", () => {
  it("shows toast and dismisses after 2s", () => {
    vi.useFakeTimers();
    render(<Harness />);
    fireEvent.click(screen.getByTestId("add"));
    expect(screen.getByTestId("toast")).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
