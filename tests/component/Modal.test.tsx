import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../../src/components/Modal";

describe("Modal", () => {
  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = vi.fn();
    render(<Modal title="hi" body="b" onConfirm={onConfirm} onCancel={() => {}} />);
    fireEvent.click(screen.getByTestId("modal-confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(<Modal title="hi" body="b" onConfirm={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId("modal-cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onCancel when backdrop clicked", () => {
    const onCancel = vi.fn();
    render(<Modal title="hi" onConfirm={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not call onCancel when modal body clicked", () => {
    const onCancel = vi.fn();
    render(<Modal title="hi" body="body" onConfirm={() => {}} onCancel={onCancel} />);
    // 点击 modal 内 body 不应该关闭
    const modal = document.querySelector(".modal") as HTMLElement;
    fireEvent.click(modal);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
