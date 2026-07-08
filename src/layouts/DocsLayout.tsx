import { BookOpen, FileText, Lock, Receipt, Server, ShieldCheck, Wallet, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { TopNav } from "../components/TopNav";

const docsNav: Array<{ label: string; to: string; Icon: LucideIcon; note: string }> = [
  { label: "Overview", to: "/docs", Icon: BookOpen, note: "Architecture map" },
  { label: "Quickstart", to: "/docs/quickstart", Icon: Zap, note: "First payment" },
  { label: "x402", to: "/docs/x402", Icon: FileText, note: "402 handshake" },
  { label: "MCP tools", to: "/docs/mcp", Icon: Server, note: "Tool schemas" },
  { label: "Policies", to: "/docs/policies", Icon: Wallet, note: "Budgets and caps" },
  { label: "Receipts", to: "/docs/receipts", Icon: Receipt, note: "Audit records" },
  { label: "Security", to: "/docs/security", Icon: Lock, note: "Key boundaries" },
];

export function DocsLayout() {
  return (
    <div className="min-h-screen bg-ink text-coin">
      <TopNav />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="rounded-lg border border-black/10 bg-white p-3 shadow-card">
            <div className="mb-3 flex items-center gap-2 border-b border-black/10 px-2 pb-3 text-sm font-semibold text-black">
              <ShieldCheck size={16} className="text-black" />
              Capri AgentPay docs
            </div>
            <nav className="space-y-1">
              {docsNav.map(({ label, to, Icon, note }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/docs"}
                  className={({ isActive }) =>
                    `group flex items-start gap-3 rounded-lg px-3 py-2.5 transition ${
                      isActive
                        ? "border border-black/20 bg-black/[0.05] text-black"
                        : "border border-transparent text-slate-600 hover:bg-black/[0.04] hover:text-black"
                    }`
                  }
                >
                  <Icon size={17} className="mt-0.5 text-slate-700" />
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-slate-500">{note}</span>
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 pb-16">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
