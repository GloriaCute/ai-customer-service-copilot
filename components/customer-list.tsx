import type { Conversation, CustomerStatus } from "../types/customer";

type CustomerListProps = { conversations: Conversation[]; selectedId: string; statuses: Record<string, CustomerStatus>; onSelect: (id: string) => void; onCreate: () => void };

const conversationTags: Record<string, string[]> = {
  "customer-a": ["退换货", "复合规则"],
  "customer-b": ["会员"],
  "customer-c": ["配送"],
  "customer-d": ["知识不足"],
};

export function CustomerList({ conversations, selectedId, statuses, onSelect, onCreate }: CustomerListProps) {
  return (
    <aside className="panel customer-panel">
      <header className="panel-header inbox-header">
        <div className="inbox-title"><h2>收件箱</h2><span>{conversations.length}</span></div>
        <button className="new-conversation-button" type="button" onClick={onCreate}><span aria-hidden="true">＋</span>新建测试会话</button>
      </header>
      <div className="customer-list">
        {conversations.map((customer) => {
          const needsReview = statuses[customer.id] === "需人工确认";
          return (
            <button className={`customer-item ${customer.id === selectedId ? "is-active" : ""}`} type="button" onClick={() => onSelect(customer.id)} key={customer.id}>
              <div className="avatar">{customer.initials}</div>
              <div className="customer-copy">
                <div className="customer-topline"><strong>{customer.name}</strong><time>{customer.time}</time></div>
                <p>{customer.question}</p>
                <div className="customer-meta">
                  {(customer.isCustom ? ["测试"] : conversationTags[customer.id] ?? [customer.topic]).map((tag) => <span className={`conversation-tag tag-${tag}`} key={tag}>{tag}</span>)}
                  {needsReview ? <span className="conversation-tag tag-review">人工确认</span> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
