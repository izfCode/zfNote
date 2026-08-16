import type { Note } from "../types";

export function toMarkdown(n: Note): string {
  const head = '# ' + (n.title || '未命名') + '\n\n';
  const body = n.content || '';
  const meta: string[] = [];
  if (n.tags && n.tags.length) meta.push('标签: ' + n.tags.map((t) => '`' + t + '`').join(', '));
  meta.push('创建: ' + new Date(n.createdAt).toISOString());
  meta.push('更新: ' + new Date(n.updatedAt).toISOString());
  return head + body + (meta.length ? '\n\n---\n\n' + meta.join('\n') + '\n' : '');
}

export function toPlainText(n: Note): string {
  const lines: string[] = [];
  if (n.title) lines.push(n.title);
  if (n.tags && n.tags.length) lines.push('#' + n.tags.join(' #'));
  if (n.content) lines.push(n.content);
  return lines.join('\n\n');
}

export function toJson(notes: Note[]): string {
  return JSON.stringify(notes, null, 2);
}

export function safeFileName(name: string): string {
  return (name || '未命名').replace(/[\\\\/*?"<>|]/g, '_');
}
