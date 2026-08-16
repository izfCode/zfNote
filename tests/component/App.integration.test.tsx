import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { App } from "../../src/App";
import { createZfApiMock, type ZfApiMock } from "../../src/tests-bootstrap/zfApiMock";

let api: ZfApiMock;

beforeEach(() => {
  api = createZfApiMock();
  api.install();
});

describe("App integration", () => {
  it("loads demo seed on first launch and selects first note", async () => {
    render(<App />);
    // 等待 useEffect 跑完
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    expect(screen.getByTestId("hud-notes").textContent).toMatch(/\d+ NOTES/);
    expect(screen.getByTestId("notes-list").textContent).toMatch(/你好/);
  });

  it("creating a new note -> edit -> debounced save", async () => {
    vi.useFakeTimers();
    render(<App />);
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    // 点击新建
    fireEvent.click(screen.getByTestId("new-note-btn"));
    // 编辑标题
    const title = screen.getByTestId("title-input") as HTMLInputElement;
    fireEvent.change(title, { target: { value: "Hello" } });
    // 编辑 body
    const body = screen.getByTestId("body-textarea") as HTMLTextAreaElement;
    fireEvent.change(body, { target: { value: "World" } });
    // 等防抖
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(api.notes.save).toHaveBeenCalled();
    const lastCall = api.notes.save.mock.calls[api.notes.save.mock.calls.length - 1][0];
    const found = lastCall.find((n: { title: string }) => n.title === "Hello");
    expect(found).toBeTruthy();
    expect(found.content).toBe("World");
    vi.useRealTimers();
  });

  it("search filters list", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    const search = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(search, { target: { value: "书" } });
    const list = screen.getByTestId("notes-list");
    expect(list.textContent).not.toMatch(/你好/);
    expect(list.textContent).toMatch(/想读的书/);
  });

  it("delete confirmation resets current", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByTestId("modal-backdrop")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("modal-confirm"));
    // 模态消失，列表少 1 项
    expect(screen.queryByTestId("modal-backdrop")).not.toBeInTheDocument();
    const items = document.querySelectorAll(".note-item");
    expect(items.length).toBe(1);
  });

  it("toggles theme via shortcut", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    fireEvent.keyDown(window, { key: "L", ctrlKey: true, shiftKey: true });
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(api.settings.setTheme).toHaveBeenCalledWith("dark");
  });

  it("Ctrl+N creates note", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    const before = document.querySelectorAll(".note-item").length;
    fireEvent.keyDown(window, { key: "n", ctrlKey: true });
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    const after = document.querySelectorAll(".note-item").length;
    expect(after).toBe(before + 1);
  });

  it("Ctrl+/ focuses search", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    fireEvent.keyDown(window, { key: "/", ctrlKey: true });
    const search = screen.getByTestId("search-input");
    expect(document.activeElement).toBe(search);
  });

  it("export markdown invokes API and shows toast", async () => {
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    fireEvent.click(screen.getByTestId("export-btn"));
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-item-md"));
    expect(api.export.saveMarkdown).toHaveBeenCalled();
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    expect(screen.getByTestId("toast")).toBeInTheDocument();
  });
});
