import type { Note } from "../types";

type Props = { note: Note };

export function StatusBar({ note }: Props) {
  const content = note.content || "";
  const chars = content.length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lines = content.split("\n").length;
  return (
    <div className="statusbar" data-testid="statusbar">
      <div className="statusbar-left" data-testid="status-left">已自动保存</div>
      <div className="statusbar-right" data-testid="status-right">
        <span>{lines} 行</span>
        <span>{words} 词</span>
        <span>{chars} 字符</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
