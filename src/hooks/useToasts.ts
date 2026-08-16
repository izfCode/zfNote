import { useCallback, useState } from "react";
import type { Toast, ToastKind } from "../types";

let counter = 0;

export function useToasts() {
  const [list, setList] = useState<Toast[]>([]);

  const toast = useCallback((message: string, icon = "✓", kind: ToastKind = "info") => {
    counter++;
    const id = counter;
    setList((cur) => [...cur, { id, message, icon, kind }]);
    setTimeout(() => setList((cur) => cur.filter((t) => t.id !== id)), 2000);
  }, []);

  return { toasts: list, toast };
}
