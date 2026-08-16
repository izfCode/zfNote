import { useCallback, useEffect, useRef, useState } from "react";
import type { Note } from "../types";
import { reducer } from "../state/notesStore";
import { createDemoSeed } from "../utils/notes";

const DEBOUNCE_MS = 350;

export type UseNotes = {
  notes: Note[];
  dispatch: (action: Parameters<typeof reducer>[1]) => void;
  ready: boolean;
};

export function useNotes(): UseNotes {
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<Note[]>([]);

  stateRef.current = notes;

  const dispatch = useCallback(
    (action: Parameters<typeof reducer>[1]) => {
      setNotes((cur) => reducer(cur, action));
      dirty.current = true;
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      let loaded: Note[] = [];
      if (typeof window !== "undefined" && window.zfApi?.notes?.load) {
        try { loaded = await window.zfApi.notes.load(); } catch { loaded = []; }
      }
      if (!mounted) return;
      if (loaded.length === 0) loaded = createDemoSeed();
      setNotes(loaded);
      setReady(true);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!dirty.current) return;
    dirty.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const data = stateRef.current;
      if (typeof window !== "undefined" && window.zfApi?.notes?.save) {
        void window.zfApi.notes.save(data);
      }
    }, DEBOUNCE_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [notes, ready]);

  return { notes, dispatch, ready };
}
