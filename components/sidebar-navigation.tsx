"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "收件箱", icon: "inbox" },
  { href: "/knowledge", label: "知识库", icon: "book" },
  { href: "/evaluation", label: "AI 评测", icon: "evaluation" },
] as const;

type NavigationIconProps = {
  name: (typeof navigationItems)[number]["icon"];
};

function NavigationIcon({ name }: NavigationIconProps) {
  if (name === "inbox") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 14h4l2 2h4l2-2h4" /></svg>;
  }

  if (name === "book") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" /><circle cx="7" cy="15" r="1" /><circle cx="11" cy="11" r="1" /><circle cx="14" cy="13" r="1" /><circle cx="19" cy="7" r="1" /></svg>;
}

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-navigation" aria-label="主导航">
      <nav>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link className={`nav-item ${isActive ? "is-active" : ""}`} href={item.href} aria-current={isActive ? "page" : undefined} key={item.href}>
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
