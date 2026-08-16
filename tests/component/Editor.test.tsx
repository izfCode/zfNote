import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Editor } from "../../src/components/Editor";
import type { Note } from "../../src/types";

const baseNote: Note = {
  id: "n1",
  title: "Hello",
  content: "world",
  tags: ["work"],
  pinned: false,
  createdAt: 0,
  updatedAt: 0,
};

describe("Editor", () => {
  it("renders title, tags and body", () => {
    render(
      <Editor note={baseNote} isPreview={false} onChange={() => {}} onAddTag={() => {}} onRemoveTag={() => {}} onCreate={() => {}} />
    );
    const title = screen.getByTestId("title-input") as HTMLInputElement;
    expect(title.value).toBe("Hello");
    const body = screen.getByTestId("body-textarea") as HTMLTextAreaElement;
    expect(body.value).toBe("world");
    expect(screen.getByText("work")).toBeInTheDocument();
  });

  it("fires onChange when title is edited", () => {
    const onChange = vi.fn();
    render(
      <Editor note={baseNote} isPreview={false} onChange={onChange} onAddTag={() => {}} onRemoveTag={() => {}} onCreate={() => {}} />
    );
    fireEvent.change(screen.getByTestId("title-input"), { target: { value: "New" } });
    expect(onChange).toHaveBeenCalledWith({ title: "New" });
  });

  it("fires onAddTag when Enter is pressed in tag input", () => {
    const onAddTag = vi.fn();
    render(
      <Editor note={baseNote} isPreview={false} onChange={() => {}} onAddTag={onAddTag} onRemoveTag={() => {}} onCreate={() => {}} />
    );
    const input = screen.getByTestId("tag-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "newtag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAddTag).toHaveBeenCalledWith("newtag");
  });

  it("removes last tag on Backspace when input empty", () => {
    const onRemoveTag = vi.fn();
    render(
      <Editor note={baseNote} isPreview={false} onChange={() => {}} onAddTag={() => {}} onRemoveTag={onRemoveTag} onCreate={() => {}} />
    );
    const input = screen.getByTestId("tag-input");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onRemoveTag).toHaveBeenCalledWith("work");
  });

  it("removes tag when × clicked", () => {
    const onRemoveTag = vi.fn();
    render(
      <Editor note={baseNote} isPreview={false} onChange={() => {}} onAddTag={() => {}} onRemoveTag={onRemoveTag} onCreate={() => {}} />
    );
    fireEvent.click(screen.getByTestId("tag-remove-work"));
    expect(onRemoveTag).toHaveBeenCalledWith("work");
  });

  it("renders markdown preview when isPreview=true", () => {
    render(
      <Editor note={{ ...baseNote, content: "**bold**" }} isPreview={true} onChange={() => {}} onAddTag={() => {}} onRemoveTag={() => {}} onCreate={() => {}} />
    );
    expect(screen.getByTestId("preview")).toBeInTheDocument();
    expect(screen.getByTestId("preview").innerHTML).toContain("<strong>bold</strong>");
    expect(screen.queryByTestId("body-textarea")).not.toBeInTheDocument();
  });
});
