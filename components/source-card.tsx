type SourceCardProps = { title: string; excerpt: string; tag: string; score?: number };

export function SourceCard({ title, excerpt, tag, score }: SourceCardProps) {
  return <article className="source-card"><div className="source-icon">文</div><div><div className="source-title"><strong>{title}</strong><span>{tag}</span></div><p>{excerpt}</p>{typeof score === "number" ? <small>相关度 {score.toFixed(2)}</small> : null}</div></article>;
}
