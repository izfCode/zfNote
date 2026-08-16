import { useEffect } from "react";

export type ShortcutHandlers = {
  onNew?: () => void;
  onTogglePreview?: () => void;
  onDelete?: () => void;
  onFocusSearch?: () => void;
  onEscape?: () => void;
  onToggleTheme?: () => void;
};

function isMod(e: KeyboardEvent): boolean {
  return e.ctrlKey || e.metaKey;
}

export function useShortcuts(h: ShortcutHandlers): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isMod(e) && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        h.onNew?.();
      } else if (isMod(e) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        h.onTogglePreview?.();
      } else if (isMod(e) && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        h.onDelete?.();
      } else if (isMod(e) && e.key === "/") {
        e.preventDefault();
        h.onFocusSearch?.();
      } else if (isMod(e) && e.shiftKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        h.onToggleTheme?.();
      } else if (e.key === "Escape") {
        h.onEscape?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [h]);

  // 监听主进程菜单事件（Electron）
  useEffect(() => {
    if (typeof window === "undefined" || !window.zfApi?.menu?.on) return;
    const offs: Array<() => void> = [];
    if (h.onNew) offs.push(window.zfApi.menu.on("menu:new-note", h.onNew));
    if (h.onTogglePreview) offs.push(window.zfApi.menu.on("menu:toggle-preview", h.onTogglePreview));
    if (h.onDelete) offs.push(window.zfApi.menu.on("menu:delete", h.onDelete));
    if (h.onFocusSearch) offs.push(window.zfApi.menu.on("menu:focus-search", h.onFocusSearch));
    if (h.onToggleTheme) offs.push(window.zfApi.menu.on("menu:toggle-theme", h.onToggleTheme));
    return () => { offs.forEach((off) => off()); };
  }, [h]);
}
