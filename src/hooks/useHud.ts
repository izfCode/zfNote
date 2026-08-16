import { useEffect, useState } from "react";
import { clockText, uptimeText } from "../utils/format";

export type HudInfo = {
  notesCount: number;
  memKb: number;
  uptime: string;
  clock: string;
};

export function useHud(notes: unknown[], bootAt: number): HudInfo {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const bytes = JSON.stringify(notes).length;
  return {
    notesCount: notes.length,
    memKb: bytes / 1024,
    uptime: uptimeText(bootAt),
    clock: clockText(),
  };
}
