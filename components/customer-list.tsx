import type { CustomerStatus, MockConversation } from "../types/customer";
import { StatusBadge } from "./status-badge";

type CustomerListProps = { conversations: MockConversation[]; selectedId: string; statuses: Record<string, CustomerStatus>; onSelect: (id: string) => void };

export function CustomerList({ conversations, selectedId, statuses, onSelect }: CustomerListProps) {
  return <aside className="panel customer-panel"><header className="panel-header"><h2>会话</h2><span className="count-chip">{conversations.length}</span></header><div className="customer-list">{conversations.map((customer) => <button className={`customer-item ${customer.id === selectedId ? "is-active" : ""}`} type="button" onClick={() => onSelect(customer.id)} key={customer.id}><div className="avatar">{customer.initials}</div><div className="customer-copy"><div className="customer-topline"><strong>{customer.name}</strong><time>{customer.time}</time></div><p>{customer.question}</p><div className="customer-meta"><StatusBadge label={statuses[customer.id]} /></div></div></button>)}</div></aside>;
}
