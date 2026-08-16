import React, { useEffect, useRef } from "react";
import type { Note } from "../types";
import { renderMarkdown } from "../utils/markdown";
import { PlusIcon } from "./icons";

type Props = {
  note: Note;
  isPreview: boolean;
  onChange: (patch: Partial<Note>) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onCreate: () => void;
};

export function Editor({ note, isPreview, onChange, onAddTag, onRemoveTag, onCreate }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note.title && titleRef.current) {
      const t = setTimeout(() => titleRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [note.id]);

  useEffect(() => {
    if (isPreview || !bodyRef.current) return;
    const ta = bodyRef.current;
    ta.style.height = "auto";
    ta.style.height = Math.max(ta.scrollHeight, 360) + "px";
  }, [note.content, isPreview]);

  const onTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const v = tagRef.current?.value.trim().replace(/^#/, "") ?? "";
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!v) return;
      onAddTag(v);
      if (tagRef.current) tagRef.current.value = "";
    } else if (e.key === "Backspace" && !tagRef.current?.value && note.tags.length) {
      const last = note.tags[note.tags.length - 1];
      onRemoveTag(last);
    }
  };

  return (
    <div className="editor-wrap" data-testid="editor-wrap">
      <div className="editor-title-wrap">
        <span className="editor-prompt">&gt;</span>
        <input
          ref={titleRef}
          type="text"
          className="editor-title"
          data-testid="title-input"
          placeholder="无标题"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className="editor-tags" data-testid="tag-row">
        {(note.tags || []).map((t) => (
          <span key={t} className="tag-chip">
            {t}
            <span className="tag-remove" data-testid={`tag-remove-${t}`} onClick={() => onRemoveTag(t)}>×</span>
          </span>
        ))}
        <input
          ref={tagRef}
          type="text"
          className="tag-input"
          data-testid="tag-input"
          placeholder={(note.tags && note.tags.length ? "添加标签..." : "+ 标签") as string}
          onKeyDown={onTagKey}
        />
      </div>
      {isPreview ? (
        <div className="preview" data-testid="preview"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content || "") }} />
      ) : (
        <textarea
          ref={bodyRef}
          className="editor-body"
          data-testid="body-textarea"
          placeholder="开始记录... 支持 Markdown（# 标题, **粗体**, - 列表, > 引用, ```代码块```）"
          value={note.content}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      )}
      <button className="floating-new" data-testid="floating-new" onClick={onCreate} title="新建笔记">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
