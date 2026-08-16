import { app, BrowserWindow, ipcMain, dialog, Menu, shell, clipboard, nativeTheme } from "electron";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { readJson, writeJsonAtomic } from "./store";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

type Prefs = {
  theme: "light" | "dark";
  windowBounds: { x?: number; y?: number; width: number; height: number };
};

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

const NOTES_FILE = () => path.join(app.getPath("userData"), "notes.json");
const PREFS_FILE = () => path.join(app.getPath("userData"), "preferences.json");

const DEFAULT_PREFS: Prefs = { theme: "light", windowBounds: { width: 1100, height: 720 } };

let mainWindow: BrowserWindow | null = null;

function createWindow(initialPrefs: Prefs): void {
  const bounds = initialPrefs.windowBounds;
  mainWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    minWidth: 760,
    minHeight: 520,
    show: false,
    backgroundColor: initialPrefs.theme === "dark" ? "#0a0e1a" : "#f8fafc",
    title: "ZF·Notes",
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => { mainWindow?.show(); });

  mainWindow.on("close", async () => {
    if (!mainWindow) return;
    const b = mainWindow.getBounds();
    try {
      const cur = await readJson<Prefs>(PREFS_FILE(), DEFAULT_PREFS);
      await writeJsonAtomic(PREFS_FILE(), { ...cur, windowBounds: b });
    } catch { /* ignore */ }
  });

  mainWindow.on("closed", () => { mainWindow = null; });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" }; });
}

function buildMenu(): void {
  const isMac = process.platform === "darwin";
  const send = (ch: string) => () => mainWindow?.webContents.send(ch);

  const macAppMenu = {
    label: app.name,
    submenu: [
      { role: "about" as const },
      { type: "separator" as const },
      { role: "services" as const },
      { type: "separator" as const },
      { role: "hide" as const },
      { role: "hideOthers" as const },
      { role: "unhide" as const },
      { type: "separator" as const },
      { role: "quit" as const },
    ],
  };

  const fileMenu = {
    label: "文件",
    submenu: [
      { label: "新建笔记", accelerator: "CmdOrCtrl+N", click: send("menu:new-note") },
      { type: "separator" as const },
      { label: "导出当前笔记为 Markdown", accelerator: "CmdOrCtrl+S", click: send("menu:export-md") },
      { label: "导出所有数据 (JSON)", click: send("menu:export-json") },
      { type: "separator" as const },
      isMac ? { role: "close" as const } : { role: "quit" as const },
    ],
  };

  const editMenu = {
    label: "编辑",
    submenu: [
      { label: "切换预览/编辑", accelerator: "CmdOrCtrl+P", click: send("menu:toggle-preview") },
      { label: "删除当前笔记", accelerator: "CmdOrCtrl+D", click: send("menu:delete") },
      { type: "separator" as const },
      { role: "undo" as const },
      { role: "redo" as const },
      { type: "separator" as const },
      { role: "cut" as const },
      { role: "copy" as const },
      { role: "paste" as const },
      { role: "selectAll" as const },
      { type: "separator" as const },
      { label: "聚焦搜索", accelerator: "CmdOrCtrl+/", click: send("menu:focus-search") },
    ],
  };

  const viewMenu = {
    label: "视图",
    submenu: [
      { label: "切换主题", accelerator: "CmdOrCtrl+Shift+L", click: send("menu:toggle-theme") },
      { type: "separator" as const },
      { role: "reload" as const },
      { role: "forceReload" as const },
      { role: "toggleDevTools" as const },
      { type: "separator" as const },
      { role: "resetZoom" as const },
      { role: "zoomIn" as const },
      { role: "zoomOut" as const },
      { type: "separator" as const },
      { role: "togglefullscreen" as const },
    ],
  };

  const helpMenu = {
    label: "帮助",
    submenu: [
      {
        label: "关于 ZF·Notes",
        click: () => {
          dialog.showMessageBox(mainWindow!, {
            type: "info",
            title: "关于",
            message: "ZF·Notes",
            detail:
              "一个轻量、本地化、支持 Markdown 的私人思考空间。\\n版本 " +
              app.getVersion() +
              "\\nElectron " +
              process.versions.electron,
          });
        },
      },
    ],
  };

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac ? [macAppMenu] : []),
    fileMenu,
    editMenu,
    viewMenu,
    helpMenu,
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ---------- IPC ----------

ipcMain.handle("notes:load", async () => {
  return await readJson<Note[]>(NOTES_FILE(), []);
});

ipcMain.handle("notes:save", async (_e, notes: Note[]) => {
  if (!Array.isArray(notes)) return false;
  await writeJsonAtomic(NOTES_FILE(), notes);
  return true;
});

ipcMain.handle("settings:get-theme", async () => {
  const p = await readJson<Prefs>(PREFS_FILE(), DEFAULT_PREFS);
  return p.theme;
});

ipcMain.handle("settings:set-theme", async (_e, theme: "light" | "dark") => {
  const cur = await readJson<Prefs>(PREFS_FILE(), DEFAULT_PREFS);
  await writeJsonAtomic(PREFS_FILE(), { ...cur, theme });
  nativeTheme.themeSource = theme;
  return true;
});

ipcMain.handle("clipboard:write-text", (_e, text: string) => {
  clipboard.writeText(text ?? "");
  return true;
});

ipcMain.handle("export:save-markdown", async (_e, suggestedName: string, content: string) => {
  const safe = (suggestedName || "未命名").replace(/[\\\\\\\\/*?"<>|]/g, "_");
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow!, {
    title: "导出为 Markdown",
    defaultPath: safe + ".md",
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });
  if (canceled || !filePath) return { ok: false };
  await fs.writeFile(filePath, content, "utf8");
  return { ok: true, filePath };
});

ipcMain.handle("export:save-text", async (_e, suggestedName: string, content: string) => {
  const safe = (suggestedName || "未命名").replace(/[\\\\\\\\/*?"<>|]/g, "_");
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow!, {
    title: "导出为纯文本",
    defaultPath: safe + ".txt",
    filters: [{ name: "Plain Text", extensions: ["txt"] }],
  });
  if (canceled || !filePath) return { ok: false };
  await fs.writeFile(filePath, content, "utf8");
  return { ok: true, filePath };
});

ipcMain.handle("export:save-json", async (_e, content: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow!, {
    title: "导出所有数据",
    defaultPath: "zf-notes-backup.json",
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (canceled || !filePath) return { ok: false };
  await fs.writeFile(filePath, content, "utf8");
  return { ok: true, filePath };
});

ipcMain.handle("app:get-version", () => app.getVersion());

// ---------- App lifecycle ----------

app.whenReady().then(async () => {
  const prefs = await readJson<Prefs>(PREFS_FILE(), DEFAULT_PREFS);
  nativeTheme.themeSource = prefs.theme;
  buildMenu();
  createWindow(prefs);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void readJson<Prefs>(PREFS_FILE(), DEFAULT_PREFS).then((p) => createWindow(p));
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
