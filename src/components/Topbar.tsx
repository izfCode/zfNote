import { useRef } from "react";
import type { Note, Theme } from "../types";
import { DownloadIcon, EditIcon, MoonIcon, PreviewIcon, StarIcon, SunIcon, TrashIcon } from "./icons";

type Props = {
  current: Note | null;
  isPreview: boolean;
  theme: Theme;
  onTogglePreview: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onToggleTheme: () => void;
  onExport: (anchor: HTMLElement) => void;
};

export function Topbar({ current, isPreview, theme, onTogglePreview, onTogglePin, onDelete, onToggleTheme, onExport }: Props) {
  const exportRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span>所有笔记</span>
          <span data-testid="crumb-note">· {current ? current.title || "无标题" : "未选择"}</span>
        </div>
      </div>
      <div className="topbar-actions" data-testid="topbar-actions">
        {!current && (
          <button className="icon-btn" data-testid="theme-btn-standalone" title="切换主题" onClick={onToggleTheme}>
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        )}
        {current && (
          <>
            <button className={"icon-btn" + (isPreview ? " active" : "")} data-testid="preview-btn"
              title={isPreview ? "编辑" : "预览"} onClick={onTogglePreview}>
              {isPreview ? <EditIcon /> : <PreviewIcon />}
            </button>
            <button className={"icon-btn" + (current.pinned ? " active" : "")} data-testid="pin-btn"
              title={current.pinned ? "取消置顶" : "置顶"} onClick={onTogglePin}>
              <StarIcon filled={current.pinned} />
            </button>
            <div className="divider-v" />
            <button className="icon-btn" data-testid="export-btn" title="导出" ref={exportRef}
              onClick={() => exportRef.current && onExport(exportRef.current)}>
              <DownloadIcon />
            </button>
            <button className="icon-btn danger" data-testid="delete-btn" title="删除" onClick={onDelete}>
              <TrashIcon />
            </button>
            <div className="divider-v" />
            <button className="icon-btn" data-testid="theme-btn" title="切换主题" onClick={onToggleTheme}>
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
