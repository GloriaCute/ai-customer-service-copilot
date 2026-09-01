export type AIStatus = "idle" | "loading" | "success" | "clarify" | "knowledge_insufficient" | "error";

export type KnowledgeSource = { title: string; tag: string; excerpt: string; score?: number; segmentId?: string };

export type AISuggestionResult = {
  status: Extract<AIStatus, "success" | "clarify" | "knowledge_insufficient">;
  answer: string;
  missingInfo: string[];
  conversationId?: string;
  sources: KnowledgeSource[];
  latencyMs: number;
};

export type AIErrorResult = { status: "error"; message: string };
export type AIResponse = AISuggestionResult | AIErrorResult;
