/**
 * 极简 Markdown 渲染器（行为与原 notes.html 一致）。
 * 支持：代码块、行内代码、标题、引用、分隔线、粗体、斜体、链接、有序/无序列表、段落。
 */

const BT = String.fromCharCode(96); // backtick

export function escapeHtml(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function applyRules(input: string): string {
  let html = input;

  // 代码块：三个反引号包围（保留可选语言标识 + 任意内容）
  html = html.replace(
    new RegExp(BT + BT + BT + '([\\w]*)\\n([\\s\\S]*?)' + BT + BT + BT, 'g'),
    (_m: string, _lang: string, code: string) => '<pre><code>' + code + '</code></pre>'
  );

  // 行内代码
  html = html.replace(
    new RegExp(BT + '([^' + BT + '\\n]+)' + BT, 'g'),
    '<code>$1</code>'
  );

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // 分隔线
  html = html.replace(/^---$/gm, '<hr>');

  // 粗体 / 斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 无序列表（连续以 - 开头的行）
  html = html.replace(/(^- .+(\n- .+)*)/gm, (block: string) => {
    const items = block
      .split('\n')
      .map((l: string) => l.replace(/^- /, ''))
      .map((l: string) => '<li>' + l + '</li>')
      .join('');
    return '<ul>' + items + '</ul>';
  });

  // 有序列表（连续以 N. 开头的行）
  html = html.replace(/(^\d+\. .+(\n\d+\. .+)*)/gm, (block: string) => {
    const items = block
      .split('\n')
      .map((l: string) => l.replace(/^\d+\. /, ''))
      .map((l: string) => '<li>' + l + '</li>')
      .join('');
    return '<ol>' + items + '</ol>';
  });

  // 段落：双换行分段；块元素原样保留
  html = html
    .split(/\n\n+/)
    .map((p: string) => {
      if (/^<(h\d|ul|ol|li|pre|blockquote|hr)/.test(p.trim())) return p;
      return p
        .split('\n')
        .map((l: string) => (l.trim() ? '<p>' + l + '</p>' : ''))
        .join('');
    })
    .join('\n');

  return html;
}

export function renderMarkdown(text: string): string {
  if (!text) return '';
  return applyRules(escapeHtml(text));
}

/**
 * 取首段作为列表预览：去掉 markdown 控制字符后截断。
 */
export function previewOf(content: string, max = 40): string {
  if (!content) return '';
  return content.replace(/[#*`>\-\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
