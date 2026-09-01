import type { AISuggestionResult, KnowledgeSource } from "../types/ai";

const REQUEST_TIMEOUT_MS = 30_000;

type DifyResource = { document_name?: unknown; dataset_name?: unknown; title?: unknown; content?: unknown; document_content?: unknown; text?: unknown; position?: unknown; score?: unknown; segment_id?: unknown; segmentId?: unknown };
type DifyPayload = { answer?: unknown; conversation_id?: unknown; metadata?: { retriever_resources?: unknown; citations?: unknown; reasoning?: unknown }; retriever_resources?: unknown; citations?: unknown };
type StructuredAnswerStatus = "supported" | "clarify" | "insufficient";
type StructuredAnswer = { answer_status: StructuredAnswerStatus; answer: string; missing_info: string[] };

export class DifyClientError extends Error {
  constructor(public readonly publicMessage: string, public readonly statusCode: number) { super(publicMessage); }
}

function getConfig() {
  const url = process.env.DIFY_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.DIFY_API_KEY;
  if (!url || !apiKey) throw new DifyClientError("AI 服务尚未完成配置，请联系管理员。", 503);
  return { url, apiKey };
}

function toSources(payload: DifyPayload): KnowledgeSource[] {
  const resources = payload.metadata?.retriever_resources ?? payload.retriever_resources ?? payload.metadata?.citations ?? payload.citations;
  if (!Array.isArray(resources)) return [];
  const sources = resources.flatMap((resource: DifyResource) => {
    const title = [resource.document_name, resource.dataset_name, resource.title].find((value): value is string => typeof value === "string" && value.trim().length > 0);
    const excerpt = [resource.content, resource.document_content, resource.text].find((value): value is string => typeof value === "string" && value.trim().length > 0);
    if (!title || !excerpt) return [];
    const segmentId = [resource.segment_id, resource.segmentId].find((value): value is string => typeof value === "string" && value.trim().length > 0);
    return [{ title, excerpt, tag: typeof resource.position === "number" ? `引用 ${resource.position}` : "知识库引用", ...(typeof resource.score === "number" && Number.isFinite(resource.score) ? { score: resource.score } : {}), ...(segmentId ? { segmentId } : {}) }];
  });
  const seen = new Set<string>();
  return sources
    .filter((source) => {
      const key = source.segmentId ? `segment:${source.segmentId}` : `content:${source.excerpt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => {
      const leftHasScore = typeof left.score === "number";
      const rightHasScore = typeof right.score === "number";
      if (leftHasScore && rightHasScore) return (right.score ?? 0) - (left.score ?? 0);
      if (leftHasScore) return -1;
      if (rightHasScore) return 1;
      return 0;
    });
}

function toUserVisibleAnswer(answer: string) {
  return answer
    .replace(/<think\b[^>]*>[\s\S]*?<\/think>\s*/gi, "")
    .replace(/<!--\s*dify-deepseek-reasoning\s*-->/gi, "")
    .replace(/<\/think>/gi, "")
    .trim();
}

function parseStructuredAnswer(rawAnswer: string): StructuredAnswer {
  const cleanedAnswer = toUserVisibleAnswer(rawAnswer);
  let parsed: unknown;
  try { parsed = JSON.parse(cleanedAnswer); }
  catch { throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502); }
  if (!parsed || typeof parsed !== "object") throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
  const candidate = parsed as { answer_status?: unknown; answer?: unknown; missing_info?: unknown };
  if (candidate.answer_status !== "supported" && candidate.answer_status !== "clarify" && candidate.answer_status !== "insufficient") throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
  if (typeof candidate.answer !== "string" || !candidate.answer.trim()) throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
  if (!Array.isArray(candidate.missing_info) || !candidate.missing_info.every((item): item is string => typeof item === "string")) throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
  const answer = toUserVisibleAnswer(candidate.answer);
  if (!answer) throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
  return { answer_status: candidate.answer_status, answer, missing_info: candidate.missing_info };
}

function isQuotaError(status: number, body: unknown) {
  const content = typeof body === "string" ? body : JSON.stringify(body ?? "");
  return status === 429 || /quota|insufficient[_\s-]?quota|provider_quota/i.test(content);
}

export async function requestDifySuggestion(query: string, conversationId?: string): Promise<AISuggestionResult> {
  const { url, apiKey } = getConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();
  try {
    const response = await fetch(`${url}/chat-messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: {}, query, response_mode: "blocking", user: "portfolio-customer-service-demo", ...(conversationId ? { conversation_id: conversationId } : {}) }),
      signal: controller.signal,
      cache: "no-store",
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (isQuotaError(response.status, body)) throw new DifyClientError("AI服务额度暂时不可用，请稍后重试。", 429);
      if (response.status === 401 || response.status === 403) throw new DifyClientError("AI 服务认证失败，请检查服务配置。", 502);
      throw new DifyClientError("AI服务暂时不可用，请稍后重试。", 502);
    }
    const payload = body as DifyPayload;
    if (typeof payload.answer !== "string" || !payload.answer.trim()) throw new DifyClientError("AI 服务返回格式异常，请稍后重试。", 502);
    const structuredAnswer = parseStructuredAnswer(payload.answer);
    const status = structuredAnswer.answer_status === "supported" ? "success" : structuredAnswer.answer_status === "clarify" ? "clarify" : "knowledge_insufficient";
    return { status, answer: structuredAnswer.answer, missingInfo: structuredAnswer.missing_info, conversationId: typeof payload.conversation_id === "string" ? payload.conversation_id : undefined, sources: toSources(payload), latencyMs: Date.now() - startedAt };
  } catch (error) {
    if (error instanceof DifyClientError) throw error;
    if (error instanceof Error && error.name === "AbortError") throw new DifyClientError("AI服务暂时不可用，请稍后重试。", 504);
    throw new DifyClientError("AI服务暂时不可用，请稍后重试。", 502);
  } finally { clearTimeout(timeout); }
}
