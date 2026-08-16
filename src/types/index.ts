export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Theme = "light" | "dark";

export type ToastKind = "info" | "success" | "warn" | "error";

export type Toast = {
  id: number;
  message: string;
  icon: string;
  kind: ToastKind;
};

export type ExportFormat = "md" | "txt" | "json" | "copy";

export type ZfApi = {
  notes: {
    load: () => Promise<Note[]>;
    save: (notes: Note[]) => Promise<boolean>;
  };
  settings: {
    getTheme: () => Promise<Theme>;
    setTheme: (theme: Theme) => Promise<boolean>;
  };
  clipboard: {
    writeText: (text: string) => Promise<boolean>;
  };
  export: {
    saveMarkdown: (
      suggestedName: string,
      content: string
    ) => Promise<{ ok: boolean; filePath?: string }>;
    saveText: (
      suggestedName: string,
      content: string
    ) => Promise<{ ok: boolean; filePath?: string }>;
    saveJson: (content: string) => Promise<{ ok: boolean; filePath?: string }>;
  };
  app: {
    getVersion: () => Promise<string>;
  };
  menu: {
    on: (channel: string, listener: () => void) => () => void;
  };
};

declare global {
  interface Window {
    zfApi: ZfApi;
  }
}
