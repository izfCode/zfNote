import type { Toast } from "../types";

type Props = { toasts: Toast[] };

export function ToastHost({ toasts }: Props) {
  return (
    <div className="toast-wrap" data-testid="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`} data-testid="toast">
          <span>{t.icon}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
