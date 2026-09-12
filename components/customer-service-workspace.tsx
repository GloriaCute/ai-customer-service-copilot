"use client";

import { useMemo, useState } from "react";
import { findMockSuggestion, mockConversations, MOCK_ERROR_TEST_QUERY, MOCK_RESPONSE_DELAY_MS } from "../lib/mock-data";
import type { AIResponse, AIStatus } from "../types/ai";
import type { Conversation, CustomerStatus } from "../types/customer";
import { AICopilotPanel } from "./ai-copilot-panel";
import { ConversationPanel } from "./conversation-panel";
import { CustomerList } from "./customer-list";
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function CustomerServiceWorkspace() {
  const [customConversations, setCustomConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState(mockConversations[0].id);
  const [mockStates, setMockStates] = useState<Record<string, AIStatus>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.mockResult.status])));
  const [mockResults, setMockResults] = useState<Record<string, ReturnType<typeof findMockSuggestion>>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.mockResult])));
  const [realResults, setRealResults] = useState<Record<string, AIResponse>>({});
  const [realLoading, setRealLoading] = useState<Record<string, boolean>>({});
  const [customerStatuses, setCustomerStatuses] = useState<Record<string, CustomerStatus>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.initialCustomerStatus])));
  const [questions, setQuestions] = useState<Record<string, string>>(() => Object.fromEntries(mockConversations.map((item) => [item.id, item.question])));
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, string[]>>({});
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>({});
  const [demoNotices, setDemoNotices] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [createError, setCreateError] = useState("");
  const [, setInputError] = useState("");
  const conversations = useMemo<Conversation[]>(() => [...mockConversations, ...customConversations], [customConversations]);
  const conversation = useMemo(() => conversations.find((item) => item.id === selectedId) ?? mockConversations[0], [conversations, selectedId]);
  const realResult = realResults[selectedId];
  const mockResult = mockResults[selectedId];
  const status = isDemoMode ? mockStates[selectedId] ?? "idle" : realLoading[selectedId] ? "loading" : realResult?.status ?? "idle";
  const successfulResult = !isDemoMode && realResult?.status !== "error" ? realResult : undefined;
  const answer = editedAnswers[selectedId] ?? (isDemoMode ? mockResult?.answer ?? "" : successfulResult?.answer ?? "");
  const sources = isDemoMode ? (status === "success" ? mockResult?.sources ?? [] : []) : successfulResult?.sources ?? [];
  const errorMessage = !isDemoMode && realResult?.status === "error" ? realResult.message : undefined;

  async function generateSuggestion() {
    const query = questions[selectedId]?.trim();
    if (!query) { setInputError("请输入客户问题后再生成建议回复。"); return; }
    setInputError("");
    const targetId = selectedId;
    setDemoNotices((value) => {
      const { [targetId]: _previousNotice, ...remainingNotices } = value;
      return remainingNotices;
    });
    setEditedAnswers((value) => {
      const { [targetId]: _previousAnswer, ...remainingAnswers } = value;
      return remainingAnswers;
    });
    if (isDemoMode) {
      if (conversation.isCustom) {
        setDemoNotices((value) => ({ ...value, [targetId]: "公开演示模式仅支持预设案例。自定义问题需要在 Real Mode 下使用。" }));
        return;
      }
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

  const displayedStatus: AIStatus = status;
  function sendReply() {
    const reply = replies[selectedId]?.trim();
    if (!reply) return;
    setSentReplies((current) => ({ ...current, [selectedId]: [...(current[selectedId] ?? []), reply] }));
    setReplies((current) => ({ ...current, [selectedId]: "" }));
  }

  function createConversation() {
    const question = newQuestion.trim();
    if (!question) { setCreateError("请输入客户问题。"); return; }
    const id = `custom-${Date.now()}`;
    const customConversation: Conversation = { id, name: "测试客户", initials: "测", topic: "自定义测试", question, time: "刚刚", initialCustomerStatus: "待处理", isCustom: true };
    setCustomConversations((current) => [...current, customConversation]);
    setQuestions((current) => ({ ...current, [id]: question }));
    setCustomerStatuses((current) => ({ ...current, [id]: "待处理" }));
    setMockStates((current) => ({ ...current, [id]: "idle" }));
    setSelectedId(id);
    setNewQuestion("");
    setCreateError("");
    setIsCreateOpen(false);
  }

  return <>
    <section className="workspace" aria-label="客服工作台"><CustomerList conversations={conversations} selectedId={selectedId} statuses={customerStatuses} onSelect={(id) => { setSelectedId(id); setInputError(""); }} onCreate={() => { setCreateError(""); setIsCreateOpen(true); }} /><ConversationPanel conversation={conversation} question={questions[selectedId] ?? conversation.question} reply={replies[selectedId] ?? ""} sentReplies={sentReplies[selectedId] ?? []} onReplyChange={(value) => setReplies((current) => ({ ...current, [selectedId]: value }))} onSend={sendReply} /><AICopilotPanel status={displayedStatus} answer={answer} errorMessage={errorMessage} idleMessage={conversation.isCustom ? "点击下方按钮，为当前客户问题生成 AI 建议。" : undefined} noticeMessage={demoNotices[selectedId]} sources={sources} latencyMs={isDemoMode ? mockResult?.latencyMs ?? 0 : successfulResult?.latencyMs ?? 0} decomposed={isDemoMode ? mockResult?.decomposed ?? false : false} isDemoMode={isDemoMode} customerStatus={customerStatuses[selectedId] ?? "待处理"} onGenerate={generateSuggestion} onAdopt={() => setReplies((current) => ({ ...current, [selectedId]: answer }))} onSaveEdit={(value) => setEditedAnswers((current) => ({ ...current, [selectedId]: value }))} onRegenerate={generateSuggestion} onEscalate={() => setCustomerStatuses((current) => ({ ...current, [selectedId]: "需人工确认" }))} /></section>
    {isCreateOpen ? <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCreateOpen(false); }}>
      <section className="create-conversation-dialog" role="dialog" aria-modal="true" aria-labelledby="create-conversation-title">
        <header><h2 id="create-conversation-title">新建测试会话</h2><button type="button" onClick={() => setIsCreateOpen(false)} aria-label="关闭">×</button></header>
        <form onSubmit={(event) => { event.preventDefault(); createConversation(); }}>
          <label htmlFor="new-customer-question">客户问题</label>
          <textarea id="new-customer-question" value={newQuestion} onChange={(event) => { setNewQuestion(event.target.value); if (createError) setCreateError(""); }} placeholder="例如：我是会员，半年前买了一台家电，可以退吗？" rows={5} autoFocus />
          {createError ? <p className="dialog-error">{createError}</p> : null}
          <footer><button className="secondary-button" type="button" onClick={() => setIsCreateOpen(false)}>取消</button><button className="copilot-primary" type="submit" disabled={!newQuestion.trim()}>创建会话</button></footer>
        </form>
      </section>
    </div> : null}
  </>;
}
