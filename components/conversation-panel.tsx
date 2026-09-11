import type { MockConversation } from "../types/customer";

type ConversationPanelProps = {
  conversation: MockConversation;
  question: string;
  reply: string;
  sentReplies: string[];
  onReplyChange: (value: string) => void;
  onSend: () => void;
};

const summaryItems = [
  ["会员身份", "会员"],
  ["购买时间", "半年前（约 180 天）"],
  ["商品类别", "家用电器"],
  ["咨询类型", "退货申请"],
] as const;

export function ConversationPanel({ conversation, question, reply, sentReplies, onReplyChange, onSend }: ConversationPanelProps) {
  const showQuestionSummary = conversation.id === "customer-a";

  return (
    <section className="panel conversation-panel">
      <header className="conversation-header">
        <div className="conversation-profile">
          <div className="conversation-title-row"><h2>{conversation.name}</h2><span className="business-tag">{conversation.topic}</span>{showQuestionSummary ? <span className="business-tag tag-composite">复合规则</span> : null}</div>
          <p>{conversation.topic === "会员咨询" ? "会员客户" : "访客客户"} · 当前会话</p>
        </div>
        <button className="more-button" type="button" aria-label="更多会话操作">•••</button>
      </header>

      <div className="chat-timeline">
        <div className="date-divider"><span>今天</span></div>
        <div className="thread-stack">
          <article className="message-row customer-message">
            <div className="avatar avatar-sm">{conversation.initials}</div>
            <div className="message-content"><div className="message-bubble">{question}</div><time>{conversation.time}</time></div>
          </article>

          {showQuestionSummary ? (
            <section className="question-summary" aria-label="问题要点">
              <div className="question-summary-header"><span>提问上下文</span><strong>问题要点</strong></div>
              <dl>{summaryItems.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </section>
          ) : null}

          {sentReplies.map((message, index) => (
            <article className="message-row agent-message" key={`${message}-${index}`}>
              <div className="message-content"><div className="message-bubble">{message}</div><time>刚刚发送</time></div>
              <div className="agent-avatar">客</div>
            </article>
          ))}
        </div>
      </div>

      <footer className="reply-composer">
        <div className="composer-frame">
          <div className="composer-heading"><label htmlFor="reply">回复客户</label><span>正在回复 {conversation.name}</span></div>
          <textarea id="reply" value={reply} onChange={(event) => onReplyChange(event.target.value)} placeholder="输入回复，或采用右侧 AI 建议…" rows={3} />
          <div className="composer-toolbar">
            <div className="composer-tools" aria-label="回复工具"><span>Aa</span><span aria-hidden="true">⌕</span><span aria-hidden="true">☺</span><span aria-hidden="true">▤</span></div>
            <button className="send-button" type="button" onClick={onSend} disabled={!reply.trim()}><span aria-hidden="true">△</span>发送</button>
          </div>
        </div>
      </footer>
    </section>
  );
}
