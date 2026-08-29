import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能客服工作台",
  description: "企业客户服务 AI Copilot",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
