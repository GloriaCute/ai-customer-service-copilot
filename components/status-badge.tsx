type StatusBadgeProps = {
  label: "待处理" | "AI 已生成" | "需人工确认";
};

const classNames = {
  待处理: "badge-pending",
  "AI 已生成": "badge-ready",
  需人工确认: "badge-review",
};

export function StatusBadge({ label }: StatusBadgeProps) {
  return <span className={`status-badge ${classNames[label]}`}>{label}</span>;
}
