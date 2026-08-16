
type Props = { hasNotes: boolean; onCreate: () => void };

export function EmptyState({ hasNotes, onCreate }: Props) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-state-icon">✦</div>
      <div className="empty-state-title">
        {hasNotes ? "选择一篇笔记开始阅读" : "欢迎使用张帆笔记"}
      </div>
      <div className="empty-state-text">
        {hasNotes ? "从左侧列表选择一篇，或点击下方按钮新建你的第一篇笔记。" : "一个轻量、本地化、支持 Markdown 的私人思考空间。"}
      </div>
      <button className="empty-state-btn" data-testid="empty-new-btn" onClick={onCreate}>
        {hasNotes ? "新建笔记" : "开始记录"}
      </button>
    </div>
  );
}
