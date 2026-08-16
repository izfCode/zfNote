import { useEffect, useRef } from "react";

export type DropdownItem = {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
};

type Props = {
  open: boolean;
  anchor: HTMLElement | null;
  items: DropdownItem[];
  onClose: () => void;
};

export function Dropdown({ open, anchor, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = () => onClose();
    setTimeout(() => document.addEventListener("click", onDoc, { once: true }), 0);
    return () => document.removeEventListener("click", onDoc);
  }, [open, onClose]);

  if (!open || !anchor) return null;
  const r = anchor.getBoundingClientRect();
  const top = r.bottom + 6;
  const right = window.innerWidth - r.right;
  return (
    <div
      ref={ref}
      className="dropdown-menu"
      data-testid="dropdown"
      style={{ position: "fixed", top, right }}
    >
      {items.map((it) => (
        <div
          key={it.id}
          className="dropdown-item"
          data-testid={`dropdown-item-${it.id}`}
          onClick={(e) => {
            e.stopPropagation();
            it.onClick();
            onClose();
          }}
        >
          {it.icon && <span style={{ marginRight: 6 }}>{it.icon}</span>}
          {it.label}
        </div>
      ))}
    </div>
  );
}
