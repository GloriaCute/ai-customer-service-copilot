type RoutePlaceholderProps = {
  title: string;
  description: string;
};

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section className="panel route-placeholder">
      <div>
        <span className="section-kicker">AI 客服 Copilot</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
