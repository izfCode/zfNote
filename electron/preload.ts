import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

const api = {
  notes: {
    load: (): Promise<Note[]> => ipcRenderer.invoke("notes:load"),
    save: (notes: Note[]): Promise<boolean> => ipcRenderer.invoke("notes:save", notes),
  },
  settings: {
    getTheme: (): Promise<"light" | "dark"> => ipcRenderer.invoke("settings:get-theme"),
    setTheme: (theme: "light" | "dark"): Promise<boolean> =>
      ipcRenderer.invoke("settings:set-theme", theme),
  },
  clipboard: {
    writeText: (text: string): Promise<boolean> =>
      ipcRenderer.invoke("clipboard:write-text", text),
  },
  export: {
    saveMarkdown: (suggestedName: string, content: string) =>
      ipcRenderer.invoke("export:save-markdown", suggestedName, content),
    saveText: (suggestedName: string, content: string) =>
      ipcRenderer.invoke("export:save-text", suggestedName, content),
    saveJson: (content: string) => ipcRenderer.invoke("export:save-json", content),
  },
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke("app:get-version"),
  },
  menu: {
    on: (channel: string, listener: () => void) => {
      const handler = (_e: IpcRendererEvent) => listener();
      ipcRenderer.on(channel, handler);
      return () => ipcRenderer.removeListener(channel, handler);
    },
  },
};

contextBridge.exposeInMainWorld("zfApi", api);

export type ZfApi = typeof api;
