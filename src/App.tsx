import { useCallback, useEffect, useState } from "react";
import type { Note, ExportFormat } from "./types";
import { Sidebar } from "./components/Sidebar";
import { HudBar } from "./components/HudBar";
import { Topbar } from "./components/Topbar";
import { Editor } from "./components/Editor";
import { StatusBar } from "./components/StatusBar";
import { EmptyState } from "./components/EmptyState";
import { ToastHost } from "./components/ToastHost";
import { Modal } from "./components/Modal";
import { Dropdown, type DropdownItem } from "./components/Dropdown";
import { MenuIcon } from "./components/icons";
import { useNotes } from "./hooks/useNotes";
import { useTheme } from "./hooks/useTheme";
import { useHud } from "./hooks/useHud";
import { useToasts } from "./hooks/useToasts";
import { useShortcuts } from "./hooks/useShortcuts";
import { toJson, toMarkdown, toPlainText } from "./utils/export";

const BOOT_AT = Date.now();

export function App() {
  const { notes, dispatch, ready } = useNotes();
  const [theme, toggleTheme] = useTheme();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);
  const { toasts, toast } = useToasts();
  const hud = useHud(notes, BOOT_AT);

  const current = notes.find((n) => n.id === currentId) || null;

  // 首次加载后自动选中第一篇
  useEffect(() => {
    if (ready && !currentId && notes.length > 0) {
      setCurrentId(notes[0].id);
    }
  }, [ready, currentId, notes.length]);

  const createNote = useCallback(() => {
    dispatch({ type: "create" });
    // 由上面的 useEffect 自动选中新的第一条
    toast("已新建笔记", "📝");
  }, [dispatch, toast]);

  const selectNote = useCallback((id: string) => setCurrentId(id), []);

  const updateCurrent = useCallback(
    (patch: Partial<Note>) => {
      if (!currentId) return;
      dispatch({ type: "update", id: currentId, patch });
    },
    [currentId, dispatch]
  );

  const togglePin = useCallback(() => {
    if (!currentId) return;
    const next = !current?.pinned;
    dispatch({ type: "togglePin", id: currentId });
    toast(next ? "已置顶" : "已取消置顶", "📌");
  }, [currentId, current?.pinned, dispatch, toast]);

  const requestDelete = useCallback(() => {
    if (!current) return;
    setPendingDelete(current);
  }, [current]);

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    dispatch({ type: "delete", id });
    if (currentId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setCurrentId(remaining[0]?.id ?? null);
    }
    setPendingDelete(null);
    toast("已删除", "🗑");
  }, [pendingDelete, currentId, dispatch, notes, toast]);

  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  const togglePreview = useCallback(() => {
    if (!currentId) return;
    setIsPreview((p) => !p);
  }, [currentId]);

  const doExport = useCallback(
    async (fmt: ExportFormat) => {
      if (!current) return;
      try {
        if (fmt === "md") {
          const r = await window.zfApi?.export?.saveMarkdown?.(current.title || "未命名", toMarkdown(current));
          if (r?.ok) toast("已导出 Markdown", "📄");
        } else if (fmt === "txt") {
          const r = await window.zfApi?.export?.saveText?.(current.title || "未命名", toPlainText(current));
          if (r?.ok) toast("已导出 TXT", "📃");
        } else if (fmt === "json") {
          const r = await window.zfApi?.export?.saveJson?.(toJson(notes));
          if (r?.ok) toast("已导出全部数据", "💾");
        } else if (fmt === "copy") {
          await window.zfApi?.clipboard?.writeText?.(current.content || "");
          toast("已复制到剪贴板", "📋");
        }
      } catch {
        toast("导出失败", "⚠");
      }
    },
    [current, notes, toast]
  );

  const focusSearch = useCallback(() => {
    const el = document.querySelector<HTMLInputElement>("[data-testid=search-input]");
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const onEscape = useCallback(() => {
    const el = document.querySelector<HTMLInputElement>("[data-testid=search-input]");
    if (el && document.activeElement === el) {
      setSearch("");
      el.blur();
      return;
    }
    if (exportAnchor) {
      setExportAnchor(null);
      return;
    }
    if (pendingDelete) {
      setPendingDelete(null);
      return;
    }
  }, [exportAnchor, pendingDelete]);

  useShortcuts({
    onNew: createNote,
    onTogglePreview: togglePreview,
    onDelete: requestDelete,
    onFocusSearch: focusSearch,
    onEscape,
    onToggleTheme: () => toggleTheme(),
  });

  const exportItems: DropdownItem[] = [
    { id: "md", label: "📄 导出为 Markdown", onClick: () => doExport("md") },
    { id: "txt", label: "📃 导出为纯文本", onClick: () => doExport("txt") },
    { id: "json", label: "💾 导出所有数据 (JSON)", onClick: () => doExport("json") },
    { id: "copy", label: "📋 复制内容", onClick: () => doExport("copy") },
  ];

  return (
    <div className={"app" + (sidebarCollapsed ? " sidebar-collapsed" : "")} data-testid="app">
      <Sidebar
        notes={notes}
        currentId={currentId}
        search={search}
        onSearch={setSearch}
        onSelect={selectNote}
        onCreate={createNote}
        collapsed={sidebarCollapsed}
      />
      <button
        className="sidebar-toggle"
        data-testid="sidebar-toggle"
        title="切换侧边栏"
        onClick={() => setSidebarCollapsed((s) => !s)}
      >
        <MenuIcon />
      </button>
      <main className="main">
        <HudBar {...hud} />
        <Topbar
          current={current}
          isPreview={isPreview}
          theme={theme}
          onTogglePreview={togglePreview}
          onTogglePin={togglePin}
          onDelete={requestDelete}
          onToggleTheme={() => toggleTheme()}
          onExport={(a) => setExportAnchor(a)}
        />
        <div className="editor-wrap-container" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {current ? (
            <Editor
              key={current.id}
              note={current}
              isPreview={isPreview}
              onChange={updateCurrent}
              onAddTag={(tag) => dispatch({ type: "addTag", id: current.id, tag })}
              onRemoveTag={(tag) => dispatch({ type: "removeTag", id: current.id, tag })}
              onCreate={createNote}
            />
          ) : (
            <EmptyState hasNotes={notes.length > 0} onCreate={createNote} />
          )}
        </div>
        {current && <StatusBar note={current} />}
      </main>
      <Dropdown
        open={!!exportAnchor}
        anchor={exportAnchor}
        items={exportItems}
        onClose={() => setExportAnchor(null)}
      />
      {pendingDelete && (
        <Modal
          title="删除笔记"
          body={`确定要删除「${pendingDelete.title || "无标题"}」吗？此操作不可撤销。`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <ToastHost toasts={toasts} />
    </div>
  );
}
