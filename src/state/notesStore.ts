import type { Note } from "../types";
import { addTag, createNote, createDemoSeed, deleteNote, removeTag, togglePin, updateNote } from "../utils/notes";

export type Action =
  | { type: "set"; notes: Note[] }
  | { type: "create"; partial?: Partial<Note> }
  | { type: "select"; id: string | null }
  | { type: "update"; id: string; patch: Partial<Note> }
  | { type: "delete"; id: string }
  | { type: "togglePin"; id: string }
  | { type: "addTag"; id: string; tag: string }
  | { type: "removeTag"; id: string; tag: string }
  | { type: "replace"; notes: Note[] };

export function reducer(notes: Note[], action: Action): Note[] {
  switch (action.type) {
    case "set":
    case "replace":
      return action.notes;
    case "create": {
      const n = createNote(action.partial);
      return [n, ...notes];
    }
    case "update":
      return updateNote(notes, action.id, action.patch);
    case "delete":
      return deleteNote(notes, action.id);
    case "togglePin":
      return togglePin(notes, action.id);
    case "addTag":
      return addTag(notes, action.id, action.tag);
    case "removeTag":
      return removeTag(notes, action.id, action.tag);
    default:
      return notes;
  }
}

export function init(seed = createDemoSeed()): Note[] {
  return seed;
}
