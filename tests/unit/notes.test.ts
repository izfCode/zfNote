import { describe, expect, it } from "vitest";
import { addTag, createDemoSeed, createNote, deleteNote, filterNotes, removeTag, sortNotes, togglePin, uid, updateNote } from "../../src/utils/notes";
import type { Note } from "../../src/types";

function n(partial: Partial<Note> = {}): Note {
  return createNote({ title: "t", content: "c", ...partial });
}

describe("utils/notes", () => {
  describe("uid", () => {
    it("returns unique values", () => {
      const set = new Set<string>();
      for (let i = 0; i < 100; i++) set.add(uid());
      expect(set.size).toBe(100);
    });
  });

  describe("createNote", () => {
    it("creates with sane defaults", () => {
      const x = createNote();
      expect(x.id).toBeTruthy();
      expect(x.title).toBe("");
      expect(x.content).toBe("");
      expect(x.tags).toEqual([]);
      expect(x.pinned).toBe(false);
      expect(typeof x.createdAt).toBe("number");
    });
    it("accepts partial overrides", () => {
      const x = createNote({ title: "hi", tags: ["a"] });
      expect(x.title).toBe("hi");
      expect(x.tags).toEqual(["a"]);
    });
  });

describe("togglePin", () => {
  it("flips pinned state", () => {
    const a = n({ pinned: false });
    const list = togglePin([a], a.id);
    expect(list[0].pinned).toBe(true);
    const list2 = togglePin(list, a.id);
    expect(list2[0].pinned).toBe(false);
  });
  it("does not mutate other notes", () => {
    const a = n({ pinned: false });
    const b = n({ pinned: true });
    const list = togglePin([a, b], a.id);
    expect(list[1]).toBe(b);
  });
});

describe("deleteNote", () => {
  it("removes by id", () => {
    const a = n(); const b = n();
    const list = deleteNote([a, b], a.id);
    expect(list).toEqual([b]);
  });
});

describe("updateNote", () => {
  it("patches and bumps updatedAt", () => {
    const a = n({ title: "old" });
    const before = a.updatedAt;
    return new Promise<void>((resolve) => setTimeout(() => {
      const list = updateNote([a], a.id, { title: "new" });
      expect(list[0].title).toBe("new");
      expect(list[0].updatedAt).toBeGreaterThanOrEqual(before);
      resolve();
    }, 2));
  });
});

describe("addTag / removeTag", () => {
  it("adds tag, trims, strips leading #", () => {
    const a = n({ tags: [] });
    let list = addTag([a], a.id, "  #work  ");
    expect(list[0].tags).toEqual(["work"]);
  });
  it("ignores empty tag", () => {
    const a = n({ tags: ["x"] });
    const list = addTag([a], a.id, "   ");
    expect(list[0].tags).toEqual(["x"]);
  });
  it("dedupes tag", () => {
    const a = n({ tags: ["x"] });
    const list = addTag([a], a.id, "x");
    expect(list[0].tags).toEqual(["x"]);
  });
  it("removes tag", () => {
    const a = n({ tags: ["x", "y"] });
    const list = removeTag([a], a.id, "x");
    expect(list[0].tags).toEqual(["y"]);
  });
});

describe("sortNotes", () => {
  it("sorts by updatedAt desc", () => {
    const old = n({ updatedAt: 100 });
    const mid = n({ updatedAt: 200 });
    const neu = n({ updatedAt: 300 });
    const sorted = sortNotes([old, neu, mid]);
    expect(sorted.map((x) => x.id)).toEqual([neu.id, mid.id, old.id]);
  });
});

describe("filterNotes", () => {
  it("filters by title/content/tag case-insensitively", () => {
    const a = n({ title: "React hooks", content: "stuff", tags: ["js"] });
    const b = n({ title: "Other", content: "react mentions", tags: [] });
    const c = n({ title: "Unrelated", content: "nope", tags: ["css"] });
    const r1 = filterNotes([a, b, c], "REACT");
    expect(r1).toHaveLength(2);
    const r2 = filterNotes([a, b, c], "js");
    expect(r2.map((x) => x.id)).toEqual([a.id]);
    const r3 = filterNotes([a, b, c], "  ");
    expect(r3).toHaveLength(3);
  });
});

describe("createDemoSeed", () => {
  it("produces 2 demo notes", () => {
    const seed = createDemoSeed();
    expect(seed.length).toBe(2);
    expect(seed[0].title).toMatch(/张帆/);
    expect(seed[0].pinned).toBe(true);
    expect(seed[1].title).toMatch(/书/);
  });
});
});
