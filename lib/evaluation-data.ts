export type EvaluationKnowledgeStatus = "知识支持" | "需要补充信息" | "知识不足";
export type EvaluationResult = "通过" | "未通过";

export type EvaluationCase = {
  id: string;
  question: string;
  scenario: string;
  expectedStatus: EvaluationKnowledgeStatus;
  actualStatus: EvaluationKnowledgeStatus;
  result: EvaluationResult;
  summary: string;
  keyFacts: Array<{ label: string; value: string }>;
  answer: string;
  sources: Array<{ name: string; description: string }>;
  checks: Array<{ label: string; passed: boolean }>;
  failureReason?: string;
};

export const evaluationCases: EvaluationCase[] = [
  {
    id: "membership-card",
    question: "会员卡丢了怎么办？",
    scenario: "简单常见问题",
    expectedStatus: "知识支持",
    actualStatus: "知识支持",
    result: "通过",
    summary: "验证单一会员规则能否被准确检索并形成明确建议。",
    keyFacts: [
      { label: "咨询对象", value: "宜家会员" },
      { label: "当前情况", value: "会员卡遗失" },
      { label: "咨询类型", value: "会员卡补领" },
    ],
    answer: "你可在宜家商场的会员自助机器上申请遗失会员卡补领，补领不会产生任何费用。",
    sources: [
      { name: "常见问题_宜家会员_V2.md", description: "遗失会员卡补领相关问答" },
    ],
    checks: [
      { label: "是否识别会员卡遗失场景", passed: true },
      { label: "是否给出会员卡补领方式", passed: true },
      { label: "是否说明补领费用", passed: true },
      { label: "回答是否由现有知识支持", passed: true },
    ],
  },
  {
    id: "member-appliance-return",
    question: "我是会员，半年前买了一台家用电器，可以退吗？",
    scenario: "复合规则问题",
    expectedStatus: "知识支持",
    actualStatus: "知识支持",
    result: "通过",
    summary: "验证会员身份、购买时间和商品类别等多条规则能否协同判断。",
    keyFacts: [
      { label: "会员身份", value: "会员" },
      { label: "购买时间", value: "半年前（约 180 天）" },
      { label: "商品类别", value: "家用电器" },
      { label: "咨询类型", value: "退货申请" },
    ],
    answer: "不可办理普通退货。根据当前退货政策，家用电器属于不适用该退货政策的商品范围，因此即使会员购买时间仍在 365 天期限内，也不能仅依据会员期限办理普通退货。",
    sources: [
      { name: "宜家退货政策_V2.md", description: "会员 365 天退货期限规则" },
      { name: "宜家退货政策_V2.md", description: "不适用退货政策商品范围" },
      { name: "宜家退货政策_V2.md", description: "家用电器相关排除规则" },
    ],
    checks: [
      { label: "是否考虑会员身份", passed: true },
      { label: "是否考虑购买时间", passed: true },
      { label: "是否考虑商品类别", passed: true },
      { label: "是否避免仅依据 365 天规则直接判断可以退货", passed: true },
      { label: "是否利用知识库判断家用电器排除规则", passed: true },
      { label: "是否避免询问不会改变结论的附加信息", passed: true },
    ],
  },
  {
    id: "nanjing-hours",
    question: "南京宜家今天几点关门？",
    scenario: "知识不足",
    expectedStatus: "知识不足",
    actualStatus: "知识不足",
    result: "通过",
    summary: "验证知识库外问题能否保持边界并交由人工确认。",
    keyFacts: [
      { label: "城市", value: "南京" },
      { label: "门店", value: "宜家" },
      { label: "时间范围", value: "今天" },
      { label: "咨询类型", value: "营业时间" },
    ],
    answer: "根据当前知识库无法确定。建议人工确认。",
    sources: [],
    checks: [
      { label: "是否避免编造营业时间", passed: true },
      { label: "是否识别为知识不足", passed: true },
      { label: "是否建议人工确认", passed: true },
    ],
  },
];
