import { describe, expect, it } from "vitest";
import { escapeHtml, previewOf, renderMarkdown } from "../../src/utils/markdown";

describe("utils/markdown", () => {
  describe("escapeHtml", () => {
    it("escapes & < > \" '", () => {
      expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
    });
    it("handles null/undefined as empty string", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
    });
  });

  describe("renderMarkdown", () => {
    it("returns empty for empty input", () => { expect(renderMarkdown("")).toBe(""); });
    it("renders h1/h2/h3", () => {
      expect(renderMarkdown("# a")).toContain("<h1>a</h1>");
      expect(renderMarkdown("## b")).toContain("<h2>b</h2>");
      expect(renderMarkdown("### c")).toContain("<h3>c</h3>");
    });
    it("renders bold and italic", () => {
      expect(renderMarkdown("**x**")).toContain("<strong>x</strong>");
      expect(renderMarkdown("*x*")).toContain("<em>x</em>");
    });
    it("renders inline code and code block", () => {
      expect(renderMarkdown("`x`")).toContain("<code>x</code>");
      const cb = renderMarkdown("```\nfoo\n```");
      expect(cb).toContain("<pre><code>foo");

    });
    it("renders links with target=_blank", () => {
      expect(renderMarkdown("[a](https://b)")).toContain('<a href="https://b" target="_blank" rel="noopener">a</a>');
    });
    it("renders unordered list", () => {
      const u = renderMarkdown("- a\n- b");
      expect(u).toContain("<ul>");
      expect(u).toContain("<li>a</li>");
      expect(u).toContain("<li>b</li>");
      expect(u).toContain("</ul>");
    });
    it("renders ordered list", () => {
      const o = renderMarkdown("1. x\n2. y");
      expect(o).toContain("<ol>");
      expect(o).toContain("<li>x</li>");
      expect(o).toContain("<li>y</li>");
      expect(o).toContain("</ol>");
    });
    it("renders <hr> for ---", () => {
      expect(renderMarkdown("---")).toContain("<hr>");
    });
    it("wraps orphan lines in <p>", () => {
      const p = renderMarkdown("l1\n\nl2");
      expect(p).toContain("<p>l1</p>");
      expect(p).toContain("<p>l2</p>");
    });
    it("escapes html in input", () => {
      const r = renderMarkdown("<script>alert(1)</script>");
      expect(r).not.toContain("<script>");
      expect(r).toContain("&lt;script&gt;");
    });
  });

  describe("previewOf", () => {
    it("removes markdown control chars and truncates", () => {
      expect(previewOf("# Title\n**bold** text", 40)).toBe("Title bold text");
    });
    it("returns empty for empty input", () => {
      expect(previewOf("")).toBe("");
    });
    it("truncates to max", () => {
      const s = "a ".repeat(50);
      expect(previewOf(s, 10).length).toBeLessThanOrEqual(10);
    });
  });
});
