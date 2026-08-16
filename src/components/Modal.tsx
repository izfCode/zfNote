
type Props = {
  title: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Modal({ title, body, confirmText = "确认", cancelText = "取消", danger = true, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-backdrop" data-testid="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
        </div>
        {body && <div className="modal-body">{body}</div>}
        <div className="modal-footer">
          <button className="btn btn-secondary" data-testid="modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} data-testid="modal-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
