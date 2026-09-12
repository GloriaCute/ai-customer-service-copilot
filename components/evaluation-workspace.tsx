"use client";

import { useMemo, useState } from "react";
import { evaluationCases, type EvaluationCase, type EvaluationKnowledgeStatus } from "../lib/evaluation-data";

function statusClass(status: EvaluationKnowledgeStatus) {
  if (status === "知识不足") return "is-insufficient";
  if (status === "需要补充信息") return "is-clarify";
  return "is-supported";
}

function ResultBadge({ result }: Pick<EvaluationCase, "result">) {
  return <span className={`evaluation-result ${result === "通过" ? "is-passed" : "is-failed"}`}>验证结果：{result}</span>;
}

export function EvaluationWorkspace() {
  const [selectedId, setSelectedId] = useState("member-appliance-return");
  const selectedCase = useMemo(
    () => evaluationCases.find((item) => item.id === selectedId) ?? evaluationCases[1],
    [selectedId],
  );

  return (
    <section className="evaluation-workspace" aria-label="代表性 AI 测试案例">
      <aside className="panel evaluation-list-panel">
        <header className="evaluation-list-header">
          <h1>代表性测试案例 <span>（{evaluationCases.length}）</span></h1>
          <p>验证简单问答、复合规则和知识不足等核心场景。</p>
        </header>
        <div className="evaluation-list">
          {evaluationCases.map((item) => (
            <button
              type="button"
              className={`evaluation-list-item ${item.id === selectedId ? "is-active" : ""}`}
              onClick={() => setSelectedId(item.id)}
              aria-pressed={item.id === selectedId}
              key={item.id}
            >
              <strong>“{item.question}”</strong>
              <p>{item.summary}</p>
              <div className="evaluation-list-meta">
                <span className={`evaluation-scenario ${statusClass(item.actualStatus)}`}><i />{item.scenario}</span>
                <span className={`evaluation-compact-result ${item.result === "通过" ? "is-passed" : "is-failed"}`}>{item.result}</span>
              </div>
            </button>
          ))}
        </div>
        <footer className="evaluation-list-footer">检验企业知识边界与人工兜底</footer>
      </aside>

      <article className="panel evaluation-detail-panel">
        <div className="evaluation-detail-scroll">
          <header className="evaluation-detail-header">
            <div>
              <h1>“{selectedCase.question}”</h1>
              <div className="evaluation-status-row">
                <span>场景类型：<strong>{selectedCase.scenario}</strong></span>
                <span>预期状态：<strong>{selectedCase.expectedStatus}</strong></span>
                <span>实际状态：<strong className={statusClass(selectedCase.actualStatus)}>{selectedCase.actualStatus}</strong></span>
              </div>
            </div>
            <ResultBadge result={selectedCase.result} />
          </header>

          <section className="evaluation-section">
            <h2><span aria-hidden="true">◇</span>问题要点</h2>
            <dl className="evaluation-facts">
              {selectedCase.keyFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
          </section>

          <section className="evaluation-section">
            <h2><span aria-hidden="true">▤</span>AI 建议回复</h2>
            <div className="evaluation-answer"><p>{selectedCase.answer}</p></div>
          </section>

          <section className="evaluation-section">
            <div className="evaluation-section-heading">
              <h2><span aria-hidden="true">▱</span>知识依据</h2>
              {selectedCase.sources.length > 0 && <small>该案例执行时检索到的资料</small>}
            </div>
            {selectedCase.sources.length > 0 ? (
              <div className="evaluation-sources">
                {selectedCase.sources.map((source, index) => (
                  <div className="evaluation-source" key={`${source.name}-${source.description}`}>
                    <span className="evaluation-source-icon" aria-hidden="true">□</span>
                    <div><strong>{source.name}</strong><p>{source.description}</p></div>
                    <span className="evaluation-source-number">{index + 1}</span>
                  </div>
                ))}
              </div>
            ) : <p className="evaluation-empty-source">检索到的资料不足以支持确定性回答。</p>}
          </section>

          <section className="evaluation-section">
            <h2><span aria-hidden="true">☷</span>验证检查</h2>
            <div className="evaluation-checks">
              {selectedCase.checks.map((check) => (
                <div className={check.passed ? "is-passed" : "is-failed"} key={check.label}>
                  <span aria-hidden="true">{check.passed ? "✓" : "×"}</span><p>{check.label}</p>
                </div>
              ))}
            </div>
          </section>

          {selectedCase.failureReason && (
            <section className="evaluation-failure">
              <h2>失败原因</h2>
              <p>{selectedCase.failureReason}</p>
            </section>
          )}
        </div>
      </article>
    </section>
  );
}
