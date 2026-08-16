import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  if ((window as unknown as { __zfApiOriginal?: unknown }).__zfApiOriginal !== undefined) {
    // 还原
  }
  // 删除已注入的 zfApi mock
  try { delete (window as any).zfApi; } catch { /* ignore */ }
});
