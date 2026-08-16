import type { Note } from "../types";

let counter = 0;

export function uid(): string {
  counter++;
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + counter.toString(36);
}

export function nowMs(): number {
  return Date.now();
}

export function createNote(partial: Partial<Note> = {}): Note {
  const t = Date.now();
  return {
    id: uid(),
    title: "",
    content: "",
    tags: [],
    pinned: false,
    createdAt: t,
    updatedAt: t,
    ...partial,
  };
}

export function togglePin(notes: Note[], id: string): Note[] {
  return notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n));
}

export function deleteNote(notes: Note[], id: string): Note[] {
  return notes.filter((n) => n.id !== id);
}

export function updateNote(notes: Note[], id: string, patch: Partial<Note>): Note[] {
  return notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n));
}

export function addTag(notes: Note[], id: string, raw: string): Note[] {
  const v = (raw || "").trim().replace(/^#/, "");
  if (!v) return notes;
  return notes.map((n) => {
    if (n.id !== id) return n;
    const tags = n.tags || [];
    if (tags.includes(v)) return n;
    return { ...n, tags: [...tags, v], updatedAt: Date.now() };
  });
}

export function removeTag(notes: Note[], id: string, tag: string): Note[] {
  return notes.map((n) =>
    n.id === id ? { ...n, tags: (n.tags || []).filter((t) => t !== tag), updatedAt: Date.now() } : n
  );
}

export function sortNotes(notes: Note[]): Note[] {
  return notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function filterNotes(notes: Note[], kw: string): Note[] {
  const k = kw.toLowerCase().trim();
  if (!k) return notes;
  return notes.filter((n) => {
    if ((n.title || "").toLowerCase().includes(k)) return true;
    if ((n.content || "").toLowerCase().includes(k)) return true;
    if ((n.tags || []).some((t) => t.toLowerCase().includes(k))) return true;
    return false;
  });
}

/**
 * 首次启动注入的 2 篇示例笔记，行为与原 notes.html 的 seedDemo 一致。
 */
export function createDemoSeed(): Note[] {
  const now = Date.now();
  const demo1: Note = {
    id: uid(),
    title: "你好,这里是张帆笔记",
    content: [
      "# 你好,这里是张帆笔记",
      "",
      "这是你的第一个笔记。你可以:",
      "",
      "- 点击左上角的「新建笔记」开始记录",
      "- 使用 # 标题 / ## 子标题 来组织内容",
      "- 用 **粗体** 和 *斜体* 让文字更有表现力",
      "- 用 - 列出待办,用 1. 列出步骤",
      "- 给笔记添加标签,方便分类",
      "",
      "> 思考即星辰,记录即轨迹。",
      "",
      "---",
      "",
      "## Markdown 速查",
      "",
      "### 标题层级",
      "### **粗体** 和 *斜体*",
      "### 行内代码 和 代码块",
      "### [链接](https://example.com)",
      "",
      "试试切换右上角的「预览」按钮,看看渲染效果。",
    ].join("\n"),
    tags: ["入门", "Markdown"],
    pinned: true,
    createdAt: now - 1000,
    updatedAt: now - 1000,
  };
  const demo2: Note = {
    id: uid(),
    title: "想读的书",
    content: [
      "## 想读的书",
      "",
      "1. 《深度工作》",
      "2. 《心流》",
      "3. 《纳瓦尔宝典》",
      "",
      "## 进度",
      "",
      "- [x] 《人类简史》",
      "- [ ] 《思考,快与慢》",
    ].join("\n"),
    tags: ["book"],
    pinned: false,
    createdAt: now - 5000,
    updatedAt: now - 5000,
  };
  return [demo1, demo2];
}
