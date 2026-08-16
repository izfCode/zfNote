/**
 * 时间格式化工具集（移植自原 notes.html 的 fmt / fmtFull）。
 */

export function fmt(ts: number, now: number = Date.now()): string {
  const diff = (now - ts) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return Math.floor(diff / 60) + " 分钟前";
  if (diff < 86400) return Math.floor(diff / 3600) + " 小时前";
  if (diff < 604800) return Math.floor(diff / 86400) + " 天前";
  return formatDate(ts);
}

export function fmtFull(ts: number): string {
  const d = new Date(ts);
  return formatDate(ts) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

export function pad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

export function clockText(d: Date = new Date()): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

export function uptimeText(boot: number, now: number = Date.now()): string {
  const sec = Math.max(0, Math.floor((now - boot) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor(sec / 60) % 60;
  const s = sec % 60;
  return pad(h) + ":" + pad(m) + ":" + pad(s);
}
