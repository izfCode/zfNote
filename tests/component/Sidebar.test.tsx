import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../../src/components/Sidebar";
import type { Note } from "../../src/types";

function makeNote(partial: Partial<Note>): Note {
  const t = Date.now();
  return { id: "id-" + Math.random().toString(36).slice(2, 6), title: "", content: "", tags: [], pinned: false, createdAt: t, updatedAt: t, ...partial };
}

describe("Sidebar", () => {
  const notes: Note[] = [
    makeNote({ id: "a", title: "Alpha", content: "apple", pinned: true, updatedAt: 300 }),
    makeNote({ id: "b", title: "Beta", content: "banana", pinned: false, updatedAt: 200 }),
    makeNote({ id: "c", title: "Gamma", content: "grape", pinned: false, updatedAt: 100 }),
  ];

  it("renders pinned and other sections with counts", () => {
    render(
      <Sidebar notes={notes} currentId="b" search="" onSearch={() => {}} onSelect={() => {}} onCreate={() => {}} collapsed={false} />
    );
    expect(screen.getByText(/已置顶/)).toBeInTheDocument();
    expect(screen.getByText(/所有笔记/)).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("marks current item as active", () => {
    render(
      <Sidebar notes={notes} currentId="a" search="" onSearch={() => {}} onSelect={() => {}} onCreate={() => {}} collapsed={false} />
    );
    const active = document.querySelector(".note-item.active");
    expect(active?.getAttribute("data-id")).toBe("a");
  });

  it("fires onSelect when clicking a note", () => {
    const onSelect = vi.fn();
    render(
      <Sidebar notes={notes} currentId={null} search="" onSearch={() => {}} onSelect={onSelect} onCreate={() => {}} collapsed={false} />
    );
    fireEvent.click(screen.getByTestId("note-item-a"));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("filters by search", () => {
    render(
      <Sidebar notes={notes} currentId={null} search="banana" onSearch={() => {}} onSelect={() => {}} onCreate={() => {}} collapsed={false} />
    );
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
  });

  it("shows empty state when no notes", () => {
    render(
      <Sidebar notes={[]} currentId={null} search="" onSearch={() => {}} onSelect={() => {}} onCreate={() => {}} collapsed={false} />
    );
    expect(screen.getByText(/还没有笔记/)).toBeInTheDocument();
  });

  it("fires onCreate when clicking the new note button", () => {
    const onCreate = vi.fn();
    render(
      <Sidebar notes={notes} currentId={null} search="" onSearch={() => {}} onSelect={() => {}} onCreate={onCreate} collapsed={false} />
    );
    fireEvent.click(screen.getByTestId("new-note-btn"));
    expect(onCreate).toHaveBeenCalled();
  });
});
