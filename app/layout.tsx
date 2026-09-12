import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 客服 Copilot",
  description: "基于企业知识的客服实时决策支持作品集原型",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
