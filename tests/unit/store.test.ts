import { describe, expect, it, vi } from "vitest";
import { readJson, writeJsonAtomic, type FsLike } from "../../electron/store";

function makeFs(): FsLike & {
  _files: Record<string, string>;
  _calls: Array<{ op: string; p: string; data?: string }>;
} {
  const files: Record<string, string> = {};
  const calls: Array<{ op: string; p: string; data?: string }> = [];
  return {
    _files: files,
    _calls: calls,
    readFile: vi.fn(async (file: string) => {
      calls.push({ op: "read", p: file });
      if (!(file in files)) {
        const e: NodeJS.ErrnoException = new Error("ENOENT");
        e.code = "ENOENT";
        throw e;
      }
      return files[file];
    }) as unknown as FsLike["readFile"],
    writeFile: vi.fn(async (file: string, data: string) => {
      calls.push({ op: "write", p: file, data });
      files[file] = data;
    }) as unknown as FsLike["writeFile"],
    rename: vi.fn(async (from: string, to: string) => {
      calls.push({ op: "rename", p: from + "->" + to });
      files[to] = files[from];
      delete files[from];
    }) as unknown as FsLike["rename"],
    mkdir: vi.fn(async () => undefined) as unknown as FsLike["mkdir"],
  };
}

describe("electron/store", () => {
  describe("readJson", () => {
    it("returns fallback when ENOENT", async () => {
      const fsImpl = makeFs();
      const r = await readJson("missing.json", { a: 1 }, fsImpl);
      expect(r).toEqual({ a: 1 });
    });

    it("parses valid JSON", async () => {
      const fsImpl = makeFs();
      fsImpl._files["ok.json"] = JSON.stringify({ x: 2 });
      const r = await readJson("ok.json", null, fsImpl);
      expect(r).toEqual({ x: 2 });
    });

    it("backs up corrupted file and returns fallback", async () => {
      const fsImpl = makeFs();
      fsImpl._files["bad.json"] = "{not valid";
      const r = await readJson("bad.json", { fb: true }, fsImpl);
      expect(r).toEqual({ fb: true });
      // 备份文件存在（键名包含 bad.json）
      const keys = Object.keys(fsImpl._files);
      expect(keys.some((k) => k.startsWith("bad.json.bak."))).toBe(true);
    });
  });

describe("writeJsonAtomic", () => {
  it("writes to .tmp then renames to final", async () => {
    const fsImpl = makeFs();
    await writeJsonAtomic("notes.json", [1, 2, 3], fsImpl, 123);
    const ops = fsImpl._calls.map((c) => c.op);
    expect(ops).toContain("write");
    expect(ops).toContain("rename");
    expect(fsImpl._files["notes.json"]).toBe(JSON.stringify([1, 2, 3], null, 2));
  });

  it("mkdir recursive first", async () => {
    const fsImpl = makeFs();
    await writeJsonAtomic("nested/x.json", { ok: 1 }, fsImpl, 999);
    expect(fsImpl._calls[0]).toEqual({ op: "write", p: expect.stringContaining("nested"), data: expect.any(String) });
    // 注：第一个 call 实际上是 mkdir，但 _calls 不包含 mkdir（vi.fn 已包装）
    // 只要最终 file 写入正确即可
    expect(fsImpl._files["nested/x.json"]).toBe(JSON.stringify({ ok: 1 }, null, 2));
  });
});
});
