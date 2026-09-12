export type KnowledgeDocument = {
  id: string;
  displayName: string;
  fileName: string;
  category: string;
  status: "已启用";
  updatedAt: string;
  source: string;
  coverage: string[];
  previews: Array<{ title: string; content: string }>;
};

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "return-policy",
    displayName: "宜家官方退换货政策",
    fileName: "宜家退货政策_V2.md",
    category: "退换货政策",
    status: "已启用",
    updatedAt: "2026-08",
    source: "公开官方资料",
    coverage: ["普通顾客退货期限", "宜家会员退货期限", "商品状态要求", "购物凭证要求", "不适用商品范围"],
    previews: [
      { title: "普通顾客与会员退货期限", content: "普通顾客可在购买后 60 天内退货；宜家俱乐部会员可在购买后 365 天内退货。两者均需满足货品完好、提供原始购物凭证和发票（如已开具），且商品不属于退货政策排除范围。" },
      { title: "退货所需条件", content: "退货时需要提供完好的货品、原始购物凭证和发票（如已开具）。原始购物凭证包括商场提供的纸质小票、宜家会员俱乐部中的订单编号等。" },
      { title: "不适用商品范围", content: "食品、家用电器商品、购买前单独签署协议的特殊定制产品，以及被切割、裁剪或油漆过的产品，不适用于宜家退货政策。" },
    ],
  },
  {
    id: "membership-faq",
    displayName: "宜家会员常见问题",
    fileName: "常见问题_宜家会员_V2.md",
    category: "会员资料",
    status: "已启用",
    updatedAt: "2026-08",
    source: "公开官方资料",
    coverage: ["会员注册", "会员卡号找回", "遗失会员卡补领", "个人信息修改", "会员首次登录"],
    previews: [
      { title: "遗失会员卡补领", content: "会员可在宜家商场的会员自助机器上申请遗失会员卡补领，补领不会产生任何费用。" },
      { title: "会员卡号找回", content: "会员可使用办理会员卡时登记的姓名与手机号码，通过指定短信方式索取会员卡号。" },
      { title: "会员信息更新", content: "会员可登录会员信息网页在线修改个人信息；如当前手机号码与预留号码不符，可联系宜家在线客服更新。" },
    ],
  },
  {
    id: "delivery-service",
    displayName: "宜家配送服务资料",
    fileName: "送货服务_宜家_V2.md",
    category: "配送服务",
    status: "已启用",
    updatedAt: "2026-08",
    source: "公开官方资料",
    coverage: ["包裹配送条件", "不适用商品", "配送范围与时效", "货车配送", "改期与二次配送"],
    previews: [
      { title: "包裹快递配送条件", content: "适用于快递包裹配送的商品，需要同时满足单件商品重量小于 30 公斤、外包装长度小于 100 厘米、宽度和高度均小于 70 厘米，且长宽高三边之和小于 165 厘米。" },
      { title: "不适合包裹配送的商品", content: "绿植、食品、涂料油漆、米布、刀具、大型装饰花瓶、部分镜子和卷式包装床垫等商品不适用快递包裹配送。" },
      { title: "送货改期", content: "如因个人原因改变原定送货日期，应在原定送货时间前一日提出。改期仅限一次且只能向后调整，小件包裹送货和极速达无法改期。" },
    ],
  },
];
