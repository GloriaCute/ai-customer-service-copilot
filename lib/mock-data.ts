import type { MockConversation } from "../types/customer";

export type MockSuggestion = MockConversation["mockResult"];

export const mockConversations: MockConversation[] = [
  { id: "customer-a", name: "客户 A", initials: "A", topic: "会员咨询", question: "我是会员，半年前买了一台家电，可以退吗？", time: "10:32", initialCustomerStatus: "AI 已生成", mockResult: { status: "success", answer: "根据退货政策，家用电器不适用于普通退货政策，因此即使您是会员且购买时间在365天以内，也不能按照该政策退货。", sources: [{ title: "宜家退货政策", tag: "会员规则", excerpt: "宜家俱乐部会员可在购买后 365 天内退货，但商品不得属于退货政策排除范围。" }, { title: "宜家退货政策", tag: "适用限制", excerpt: "家用电器不适用于宜家普通退货政策。" }], latencyMs: 1280, decomposed: true } },
  { id: "customer-b", name: "客户 B", initials: "B", topic: "会员咨询", question: "会员卡丢了怎么办？", time: "09:48", initialCustomerStatus: "AI 已生成", mockResult: { status: "success", answer: "可以在宜家商场会员自助机器申请遗失会员卡补领，补领不产生费用。", sources: [{ title: "宜家会员常见问题", tag: "会员卡", excerpt: "可在宜家商场会员自助机器申请遗失会员卡补领，补领不会产生任何费用。" }], latencyMs: 760, decomposed: false } },
  { id: "customer-c", name: "客户 C", initials: "C", topic: "送货咨询", question: "一个35公斤的商品可以用包裹快递吗？", time: "昨天", initialCustomerStatus: "待处理", mockResult: { status: "success", answer: "不可以。包裹快递配送要求单件商品重量小于30公斤。", sources: [{ title: "宜家送货服务", tag: "包裹配送", excerpt: "适用于快递包裹配送的商品，需要同时满足单件商品重量小于 30 公斤。" }], latencyMs: 920, decomposed: false } },
  { id: "customer-d", name: "客户 D", initials: "D", topic: "门店咨询", question: "南京宜家今天几点关门？", time: "昨天", initialCustomerStatus: "需人工确认", mockResult: { status: "knowledge_insufficient", answer: "根据当前知识库无法确定。", sources: [], latencyMs: 680, decomposed: false } },
];

export const MOCK_RESPONSE_DELAY_MS = 850;
export const MOCK_ERROR_TEST_QUERY = "模拟 API 异常";

const knowledgeInsufficientResult: MockSuggestion = {
  status: "knowledge_insufficient",
  answer: "根据当前知识库无法确定。",
  sources: [],
  latencyMs: 680,
  decomposed: false,
};

function normalizeQuestion(question: string) {
  return question.toLowerCase().replace(/[\s，。！？、,.!?]/g, "");
}

export function findMockSuggestion(question: string): MockSuggestion {
  const normalized = normalizeQuestion(question);
  if (normalized.includes("会员") && normalized.includes("半年") && normalized.includes("家电")) return mockConversations[0].mockResult;
  if (normalized.includes("会员卡") && /丢|遗失|补领/.test(normalized)) return mockConversations[1].mockResult;
  if (normalized.includes("35") && normalized.includes("公斤") && /包裹|快递|配送/.test(normalized)) return mockConversations[2].mockResult;
  if (normalized.includes("南京") && /关门|营业/.test(normalized)) return mockConversations[3].mockResult;
  return knowledgeInsufficientResult;
}
