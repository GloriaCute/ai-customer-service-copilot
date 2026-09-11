"use client";

import { usePathname } from "next/navigation";

const pageMeta = {
  "/inbox": { label: "收件箱", description: "处理客户会话并使用企业知识生成建议" },
  "/knowledge": { label: "知识库", description: "查看 AI 当前可使用的企业知识资料" },
  "/evaluation": { label: "AI 评测", description: "查看代表性案例的回答状态与验证结果" },
} as const;

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function PageHeader() {
  const pathname = usePathname();
  const currentPage = pageMeta[pathname as keyof typeof pageMeta] ?? pageMeta["/inbox"];

  return (
    <header className="app-header">
      <div className="app-identity">
        <div className="brand-mark" aria-hidden="true">宜</div>
        <div>
          <div className="brand-title-row">
            <span className="brand-title">AI 客服 Copilot</span>
            <span className="page-label">{currentPage.label}</span>
          </div>
          <p>{currentPage.description}</p>
        </div>
      </div>
      <div className="header-status">
        {isDemoMode ? (
          <span className="mode-label">演示数据</span>
        ) : (
          <>
            <span className="connection-label"><span className="status-dot" />企业知识已连接</span>
            <span className="header-divider" aria-hidden="true" />
            <span className="provider-label">知识托管：Dify Cloud</span>
          </>
        )}
      </div>
    </header>
  );
}
