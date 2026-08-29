import { NextResponse } from "next/server";
import { DifyClientError, requestDifySuggestion } from "../../../lib/dify";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 2_000;

export async function POST(request: Request) {
  let payload: { query?: unknown; conversationId?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ status: "error", message: "请求格式无效。" }, { status: 400 }); }
  const query = typeof payload.query === "string" ? payload.query.trim() : "";
  const conversationId = typeof payload.conversationId === "string" && payload.conversationId.trim() ? payload.conversationId.trim() : undefined;
  if (!query) return NextResponse.json({ status: "error", message: "请输入客户问题后再生成建议回复。" }, { status: 400 });
  if (query.length > MAX_QUERY_LENGTH) return NextResponse.json({ status: "error", message: "客户问题过长，请缩短后重试。" }, { status: 400 });
  try { return NextResponse.json(await requestDifySuggestion(query, conversationId)); }
  catch (error) { const resolved = error instanceof DifyClientError ? error : new DifyClientError("AI服务暂时不可用，请稍后重试。", 502); return NextResponse.json({ status: "error", message: resolved.publicMessage }, { status: resolved.statusCode }); }
}
