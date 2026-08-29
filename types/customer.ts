import type { AIStatus, KnowledgeSource } from "./ai";

export type CustomerStatus = "待处理" | "AI 已生成" | "需人工确认";

export type MockConversation = {
  id: string; name: string; initials: string; topic: string; question: string; time: string; initialCustomerStatus: CustomerStatus;
  mockResult: { status: Exclude<AIStatus, "idle" | "loading">; answer: string; sources: KnowledgeSource[]; latencyMs: number; decomposed: boolean };
};
