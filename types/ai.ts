export type AIStatus = "idle" | "loading" | "success" | "knowledge_insufficient" | "error";

export type KnowledgeSource = { title: string; tag: string; excerpt: string; score?: number };

export type AISuggestionResult = {
  status: Extract<AIStatus, "success" | "knowledge_insufficient">;
  answer: string;
  conversationId?: string;
  sources: KnowledgeSource[];
  latencyMs: number;
};

export type AIErrorResult = { status: "error"; message: string };
export type AIResponse = AISuggestionResult | AIErrorResult;
