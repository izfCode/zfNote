/**
 * 主进程用 JSON 文件存储封装。
 * - readJson: 缺失返回 fallback；损坏自动备份为 .bak.<ts> 并返回 fallback。
 * - writeJsonAtomic: 写到 .tmp 后 rename，避免半截 JSON。
 *
 * 可单测：注入 fs。
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";

export interface FsLike {
  readFile: (file: string, enc: string) => Promise<string>;
  writeFile: (file: string, data: string, enc: string) => Promise<void>;
  rename: (oldPath: string, newPath: string) => Promise<void>;
  mkdir: (dir: string, opts: { recursive: boolean }) => Promise<void>;
}

export async function readJson<T>(
  file: string,
  fallback: T,
  fsImpl: FsLike = fs as unknown as FsLike
): Promise<T> {
  let raw: string;
  try {
    raw = await fsImpl.readFile(file, "utf8");
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      await fsImpl.rename(file, file + ".bak." + Date.now());
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

export async function writeJsonAtomic(
  file: string,
  data: unknown,
  fsImpl: FsLike = fs as unknown as FsLike,
  pid: number = process.pid
): Promise<void> {
  const dir = path.dirname(file);
  await fsImpl.mkdir(dir, { recursive: true });
  const tmp = file + "." + pid + ".tmp";
  await fsImpl.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fsImpl.rename(tmp, file);
}
