import type { ReactNode } from "react";
import { PageHeader } from "./page-header";
import { SidebarNavigation } from "./sidebar-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <PageHeader />
      <div className="app-body">
        <SidebarNavigation />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
