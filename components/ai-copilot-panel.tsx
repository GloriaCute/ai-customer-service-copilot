"use client";

import { useEffect, useState } from "react";
import type { AIStatus, KnowledgeSource } from "../types/ai";
import type { CustomerStatus } from "../types/customer";
import { SourceCard } from "./source-card";

type AICopilotPanelProps = { status: AIStatus; answer: string; errorMessage?: string; sources: KnowledgeSource[]; latencyMs: number; decomposed: boolean; isDemoMode: boolean; customerStatus: CustomerStatus; onGenerate: () => void; onAdopt: () => void; onSaveEdit: (value: string) => void; onRegenerate: () => void; onEscalate: () => void };
const statusCopy: Record<AIStatus, string> = { idle: "待生成", loading: "正在生成", success: "知识支持", clarify: "需要补充信息", knowledge_insufficient: "知识不足", error: "服务异常" };

export function AICopilotPanel({ status, answer, errorMessage, sources, latencyMs, decomposed, isDemoMode, customerStatus, onGenerate, onAdopt, onSaveEdit, onRegenerate, onEscalate }: AICopilotPanelProps) {
  const [isEditing, setIsEditing] = useState(false); const [editValue, setEditValue] = useState(answer); const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  useEffect(() => { setIsEditing(false); setEditValue(answer); setIsDetailsOpen(false); }, [answer]);
  const isLoading = status === "loading"; const hasAnswer = status === "success" || status === "clarify" || status === "knowledge_insufficient"; const isInsufficient = status === "knowledge_insufficient";
  const visibleSources = sources.slice(0, 3);
  const sourceCountLabel = visibleSources.length ? `${visibleSources.length}` : "—";
  function saveEdit() { onSaveEdit(editValue.trim() || answer); setIsEditing(false); }
  const answerContent = isLoading ? "AI 正在检索企业知识并整理建议…" : status === "error" ? errorMessage ?? "AI 服务暂时不可用，请稍后重试。" : hasAnswer ? answer : "选择会话后，生成一条可供客服审核的建议回复。";
  return (
    <aside className="panel copilot-panel">
      <header className="copilot-header">
        <div className="copilot-title"><span className="copilot-symbol" aria-hidden="true">✦</span><h2>AI 客服助手</h2></div>
        <span className={`copilot-state state-${status}`}><span className="state-dot" />{statusCopy[status]}</span>
      </header>
      <div className="copilot-scroll">
        <p className="copilot-description">基于宜家公开官方退换货与会员资料生成可审核建议。</p>
        <section className="suggestion-section">
          <div className="section-title"><h3>建议回复</h3></div>
          <div className={`ai-answer ${isInsufficient ? "answer-insufficient" : ""}`}>
            {isEditing ? <textarea className="answer-editor" aria-label="编辑 AI 建议回复" value={editValue} onChange={(event) => setEditValue(event.target.value)} rows={8} /> : <p className={isLoading ? "loading-copy" : undefined}>{answerContent}</p>}
          </div>
          {isInsufficient ? <p className="insufficient-notice">知识依据不足，建议人工确认</p> : null}
        </section>

        {hasAnswer ? (
          <>
            <div className="copilot-actions">
              <button className="copilot-primary full-button" type="button" onClick={onAdopt}>✓ 采用回复</button>
              <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}>编辑</button>
              <button className="secondary-button" type="button" onClick={onRegenerate}>重新生成</button>
              <button className={`secondary-button ${isInsufficient ? "human-review-button" : ""}`} type="button" onClick={onEscalate}>人工确认</button>
              {isEditing ? <button className="secondary-button full-button" type="button" onClick={saveEdit}>保存修改</button> : null}
            </div>
            <section className="sources-section">
              <div className="section-title"><h3>{visibleSources.length ? `知识依据（${sourceCountLabel}）` : "知识依据"}</h3></div>
              {visibleSources.length ? visibleSources.map((source) => <SourceCard key={source.segmentId ?? `${source.title}-${source.tag}`} {...source} />) : <p className="empty-sources">暂无可展示知识来源</p>}
            </section>
            <section className="processing-section">
              <button className="details-toggle" type="button" aria-expanded={isDetailsOpen} onClick={() => setIsDetailsOpen((value) => !value)}><span>查看处理详情</span><span className={`details-chevron ${isDetailsOpen ? "is-open" : ""}`}>⌄</span></button>
              {isDetailsOpen ? <div className="details-grid"><span>请求状态</span><strong>{statusCopy[status]}</strong><span>{isDemoMode ? "模拟响应耗时" : "响应耗时"}</span><strong>{`${latencyMs} ms`}</strong><span>引用知识数量</span><strong>{sourceCountLabel}</strong>{isDemoMode ? <><span>查询拆解</span><strong>{decomposed ? "已拆解" : "—"}</strong><span>人工审核状态</span><strong>{customerStatus}</strong></> : null}</div> : null}
            </section>
          </>
        ) : status !== "loading" ? <button className="copilot-primary generate-suggestion-button" type="button" onClick={onGenerate}>{status === "error" ? "重新尝试" : "生成 AI 建议"}</button> : null}
      </div>
    </aside>
  );
}
