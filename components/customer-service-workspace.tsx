"use client";

import { useMemo, useState } from "react";
import { findMockSuggestion, mockConversations, MOCK_ERROR_TEST_QUERY, MOCK_RESPONSE_DELAY_MS } from "../lib/mock-data";
import type { AIResponse, AIStatus } from "../types/ai";
import type { CustomerStatus } from "../types/customer";
import { AICopilotPanel } from "./ai-copilot-panel";
import { ConversationPanel } from "./conversation-panel";
import { CustomerList } from "./customer-list";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function CustomerServiceWorkspace() {
  const [selectedId, setSelectedId] = useState(mockConversations[0].id);
  const [mockStates, setMockStates] = useState<Record<string, AIStatus>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.mockResult.status])));
  const [mockResults, setMockResults] = useState<Record<string, ReturnType<typeof findMockSuggestion>>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.mockResult])));
  const [realResults, setRealResults] = useState<Record<string, AIResponse>>({});
  const [realLoading, setRealLoading] = useState<Record<string, boolean>>({});
  const [customerStatuses, setCustomerStatuses] = useState<Record<string, CustomerStatus>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.initialCustomerStatus])));
  const [questions, setQuestions] = useState<Record<string, string>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.question])));
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>({});
  const [inputError, setInputError] = useState("");
  const conversation = useMemo(() => mockConversations.find((item) => item.id === selectedId) ?? mockConversations[0], [selectedId]);
  const realResult = realResults[selectedId];
  const mockResult = mockResults[selectedId] ?? conversation.mockResult;
  const status = isDemoMode ? mockStates[selectedId] : realLoading[selectedId] ? "loading" : realResult?.status ?? "idle";
  const successfulResult = !isDemoMode && realResult?.status !== "error" ? realResult : undefined;
  const answer = editedAnswers[selectedId] ?? (isDemoMode ? mockResult.answer : successfulResult?.answer ?? "");
  const sources = isDemoMode ? (status === "success" ? mockResult.sources : []) : successfulResult?.sources ?? [];
  const latency = isDemoMode ? (status === "success" || status === "knowledge_insufficient" ? `${mockResult.latencyMs} ms` : "—") : successfulResult ? `${successfulResult.latencyMs} ms` : "—";
  const errorMessage = !isDemoMode && realResult?.status === "error" ? realResult.message : undefined;
  const isLoading = status === "loading";

  async function generateSuggestion() {
    const query = questions[selectedId]?.trim();
    if (!query) { setInputError("请输入客户问题后再生成建议回复。"); return; }
    setInputError("");
    const targetId = selectedId;
    setEditedAnswers((value) => {
      const { [targetId]: _previousAnswer, ...remainingAnswers } = value;
      return remainingAnswers;
    });
    if (isDemoMode) {
      setMockStates((value) => ({ ...value, [targetId]: "loading" }));
      window.setTimeout(() => {
        const result = findMockSuggestion(query);
        const mockStatus = query === MOCK_ERROR_TEST_QUERY ? "error" : result.status;
        if (mockStatus !== "error") setMockResults((value) => ({ ...value, [targetId]: result }));
        setMockStates((value) => ({ ...value, [targetId]: mockStatus }));
        setCustomerStatuses((value) => ({ ...value, [targetId]: mockStatus === "knowledge_insufficient" ? "需人工确认" : mockStatus === "success" ? "AI 已生成" : "待处理" }));
      }, MOCK_RESPONSE_DELAY_MS);
      return;
    }
    setRealLoading((value) => ({ ...value, [targetId]: true }));
    try {
      const previous = realResults[targetId];
      const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, conversationId: previous?.status !== "error" ? previous?.conversationId : undefined }) });
      const result = await response.json() as AIResponse;
      if (!response.ok || result.status === "error") throw new Error(result.status === "error" ? result.message : "AI服务暂时不可用，请稍后重试。");
      setRealResults((value) => ({ ...value, [targetId]: result }));
      setCustomerStatuses((value) => ({ ...value, [targetId]: result.status === "knowledge_insufficient" ? "需人工确认" : "AI 已生成" }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : "AI服务暂时不可用，请稍后重试。";
      setRealResults((value) => ({ ...value, [targetId]: { status: "error", message } }));
    } finally { setRealLoading((value) => ({ ...value, [targetId]: false })); }
  }

  const loadingStatus = status === "loading";
  const displayedStatus: AIStatus = status;
  return <main className="app-shell">
    <header className="app-header"><div className="app-identity"><div className="brand-mark">CS</div><div><h1>智能客服工作台</h1><p>客户服务 · AI Copilot</p></div></div><div className="header-status">{isDemoMode ? <span className="mode-label">演示数据</span> : <span className="connection-label"><span className="status-dot" />知识库已连接</span>}</div></header>
    <section className="workspace" aria-label="客服工作台"><CustomerList conversations={mockConversations} selectedId={selectedId} statuses={customerStatuses} onSelect={(id) => { setSelectedId(id); setInputError(""); }} /><ConversationPanel conversation={conversation} question={questions[selectedId]} reply={replies[selectedId] ?? ""} inputError={inputError} isLoading={loadingStatus} isDemoMode={isDemoMode} onQuestionChange={(value) => setQuestions((current) => ({ ...current, [selectedId]: value }))} onReplyChange={(value) => setReplies((current) => ({ ...current, [selectedId]: value }))} onGenerate={generateSuggestion} /><AICopilotPanel status={displayedStatus} answer={answer} errorMessage={errorMessage} sources={sources} latencyMs={isDemoMode ? mockResult.latencyMs : successfulResult?.latencyMs ?? 0} decomposed={isDemoMode ? mockResult.decomposed : false} isDemoMode={isDemoMode} customerStatus={customerStatuses[selectedId]} onAdopt={() => setReplies((current) => ({ ...current, [selectedId]: answer }))} onSaveEdit={(value) => setEditedAnswers((current) => ({ ...current, [selectedId]: value }))} onRegenerate={generateSuggestion} onEscalate={() => setCustomerStatuses((current) => ({ ...current, [selectedId]: "需人工确认" }))} /></section>
  </main>;
}
