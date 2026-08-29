type MetricsCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: "neutral";
};

export function MetricsCard({ label, value, detail }: MetricsCardProps) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
