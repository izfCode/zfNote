import { vi } from "vitest";
import type { Note, Theme } from "../types";

export type ZfApiMock = {
  notes: {
    load: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  settings: {
    getTheme: ReturnType<typeof vi.fn>;
    setTheme: ReturnType<typeof vi.fn>;
  };
  clipboard: { writeText: ReturnType<typeof vi.fn> };
  export: {
    saveMarkdown: ReturnType<typeof vi.fn>;
    saveText: ReturnType<typeof vi.fn>;
    saveJson: ReturnType<typeof vi.fn>;
  };
  app: { getVersion: ReturnType<typeof vi.fn> };
  menu: {
    on: ReturnType<typeof vi.fn>;
  };
  _listeners: Record<string, Array<() => void>>;
  _emit: (channel: string) => void;
  install: (initial?: { notes?: Note[]; theme?: Theme }) => void;
};

export function createZfApiMock(): ZfApiMock {
  const listeners: Record<string, Array<() => void>> = {};
  const on = vi.fn((channel: string, listener: () => void) => {
    listeners[channel] = listeners[channel] || [];
    listeners[channel].push(listener);
    return () => {
      listeners[channel] = (listeners[channel] || []).filter((l) => l !== listener);
    };
  });
  const emit = (channel: string) => {
    (listeners[channel] || []).forEach((l) => l());
  };
  const mock: ZfApiMock = {
    notes: { load: vi.fn(async () => []), save: vi.fn(async () => true) },
    settings: {
      getTheme: vi.fn(async () => "light" as Theme),
      setTheme: vi.fn(async () => true),
    },
    clipboard: { writeText: vi.fn(async () => true) },
    export: {
      saveMarkdown: vi.fn(async () => ({ ok: true, filePath: "/tmp/x.md" })),
      saveText: vi.fn(async () => ({ ok: true, filePath: "/tmp/x.txt" })),
      saveJson: vi.fn(async () => ({ ok: true, filePath: "/tmp/x.json" })),
    },
    app: { getVersion: vi.fn(async () => "1.0.0") },
    menu: { on },
    _listeners: listeners,
    _emit: emit,
    install: (initial) => {
      if (initial?.notes) mock.notes.load.mockResolvedValue(initial.notes);
      if (initial?.theme) mock.settings.getTheme.mockResolvedValue(initial.theme);
      (window as unknown as { zfApi: unknown }).zfApi = mock;
    },
  };
  return mock;
}
