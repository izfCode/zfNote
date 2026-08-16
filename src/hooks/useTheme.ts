import { useCallback, useEffect, useState } from "react";
import type { Theme } from "../types";

export function useTheme(): [Theme, (t?: Theme) => void, boolean] {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined" && window.zfApi?.settings?.getTheme) {
      window.zfApi.settings.getTheme().then((t) => {
        if (!mounted) return;
        setTheme(t);
        document.documentElement.setAttribute("data-theme", t);
        setReady(true);
      });
    } else {
      // 浏览器/Electron 缺失 zfApi 时回退到 localStorage
      try {
        const saved = (localStorage.getItem("zf-theme") as Theme | null) || "light";
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      } catch { /* ignore */ }
      setReady(true);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const toggle = useCallback(
    (next?: Theme) => {
      const t: Theme = next || (theme === "light" ? "dark" : "light");
      setTheme(t);
      document.documentElement.setAttribute("data-theme", t);
      if (window.zfApi?.settings?.setTheme) {
        void window.zfApi.settings.setTheme(t);
      } else {
        try { localStorage.setItem("zf-theme", t); } catch { /* ignore */ }
      }
    },
    [theme]
  );

  return [theme, toggle, ready];
}
