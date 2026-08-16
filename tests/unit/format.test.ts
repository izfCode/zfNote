import { describe, expect, it } from "vitest";
import { clockText, fmt, fmtFull, formatDate, pad, uptimeText } from "../../src/utils/format";

describe("utils/format", () => {
  describe("pad", () => {
    it("zero-pads numbers below 10", () => { expect(pad(0)).toBe("00"); expect(pad(9)).toBe("09"); });
    it("keeps numbers >= 10 as-is", () => { expect(pad(10)).toBe("10"); expect(pad(23)).toBe("23"); });
  });

  describe("fmt", () => {
    const now = 1_700_000_000_000;
    it("< 60s => 刚刚", () => { expect(fmt(now - 30 * 1000, now)).toBe("刚刚"); });
    it("< 60min => N 分钟前", () => { expect(fmt(now - 5 * 60 * 1000, now)).toBe("5 分钟前"); });
    it("< 24h => N 小时前", () => { expect(fmt(now - 3 * 3600 * 1000, now)).toBe("3 小时前"); });
    it("< 7d => N 天前", () => { expect(fmt(now - 2 * 86400 * 1000, now)).toBe("2 天前"); });
    it(">= 7d => YYYY-MM-DD", () => {
      const ts = Date.UTC(2025, 0, 5, 12, 0); // 2025-01-05 12:00 UTC
      expect(fmt(ts, ts + 10 * 86400 * 1000)).toBe("2025-01-05");
    });
  });

  describe("fmtFull", () => {
    it("formats date + time zero-padded", () => {
      const ts = Date.UTC(2025, 5, 7, 9, 5);
      // 取决于本地时区，宽松断言：YYYY-MM-DD HH:MM
      const s = fmtFull(ts);
      expect(s).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  describe("formatDate", () => {
    it("returns YYYY-MM-DD", () => {
      const ts = Date.UTC(2025, 0, 1, 0, 0);
      // 时区无关测试：断言匹配形状
      expect(formatDate(ts)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

describe("clockText", () => {
  it("returns HH:MM:SS using given Date", () => {
    const d = new Date(2025, 0, 1, 3, 4, 5);
    expect(clockText(d)).toBe("03:04:05");
  });
});

describe("uptimeText", () => {
  it("formats boot diff as HH:MM:SS", () => {
    const boot = 0;
    const now = (3661 * 1000);
    expect(uptimeText(boot, now)).toBe("01:01:01");
  });
  it("clamps at zero when boot > now", () => {
    expect(uptimeText(100, 0)).toBe("00:00:00");
  });
});
});
