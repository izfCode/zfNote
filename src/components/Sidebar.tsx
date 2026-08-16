import type { Note } from "../types";
import { filterNotes, sortNotes } from "../utils/notes";
import { fmt } from "../utils/format";
import { previewOf } from "../utils/markdown";
import { PlusIcon, SearchIcon } from "./icons";

type Props = {
  notes: Note[];
  currentId: string | null;
  search: string;
  onSearch: (v: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  collapsed: boolean;
};

function renderItem(n: Note, isActive: boolean, onClick: () => void) {
  const preview = previewOf(n.content || "");
  return (
    <div
      key={n.id}
      className={"note-item" + (isActive ? " active" : "")}
      data-id={n.id}
      data-testid={"note-item-" + n.id}
      onClick={onClick}
    >
      <div className="note-item-title">
        {n.pinned && <span className="pin-icon">📌</span>}
        {n.title || "无标题"}
      </div>
      {preview && <div className="note-item-preview">{preview}</div>}
      <div className="note-item-meta">
        <span>{fmt(n.updatedAt)}</span>
        {n.tags && n.tags[0] && <span className="note-tag">{n.tags[0]}</span>}
      </div>
    </div>
  );
}

export function Sidebar({ notes, currentId, search, onSearch, onSelect, onCreate, collapsed }: Props) {
  const list = filterNotes(notes, search);
  const sorted = sortNotes(list);
  const pinned = sorted.filter((n) => n.pinned);
  const others = sorted.filter((n) => !n.pinned);
  const noResults = list.length === 0;

  return (
    <aside className={"sidebar" + (collapsed ? " collapsed" : "")} data-testid="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"><span className="cursor">&gt;_</span></div>
          <div>
            <div className="logo-title">ZF·NOTES</div>
            <div className="logo-subtitle"><span className="path">~/</span>张帆笔记</div>
          </div>
        </div>
      </div>
      <div className="search-wrap">
        <div className="search-box">
          <SearchIcon size={14} />
          <input
            type="text"
            className="search-input"
            data-testid="search-input"
            placeholder="搜索笔记..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <button className="new-note-btn" data-testid="new-note-btn" onClick={onCreate}>
        <PlusIcon size={14} />
        新建笔记
      </button>
      <div className="notes-list" data-testid="notes-list">
        {noResults && (
          <div className="empty-list">
            <div className="empty-list-icon">📝</div>
            <div>{search ? "没有匹配的笔记" : "还没有笔记"}</div>
            <div style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
              {search ? "试试别的关键词" : "点击「新建笔记」开始记录"}
            </div>
          </div>
        )}
        {pinned.length > 0 && (
          <div className="list-section-title">
            📌 已置顶 <span className="count">{pinned.length}</span>
          </div>
        )}
        {pinned.map((n) =>
          renderItem(n, n.id === currentId, () => onSelect(n.id))
        )}
        {others.length > 0 && (
          <div className="list-section-title">
            📄 所有笔记 <span className="count">{others.length}</span>
          </div>
        )}
        {others.map((n) =>
          renderItem(n, n.id === currentId, () => onSelect(n.id))
        )}
      </div>
    </aside>
  );
}
