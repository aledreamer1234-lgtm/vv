import { ArrowRight, BookOpen, FileText, Server, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useTitle } from "../../lib/useTitle";
import { Card, DocsHeader, DocsSection } from "../../components/docs/DocsUI";

const map: Array<{ to: string; title: string; body: string }> = [
  { to: "/docs/quickstart", title: "Quickstart", body: "Install the SDK, register an agent, and settle your first x402 request in minutes." },
  { to: "/docs/x402", title: "x402 protocol", body: "How Capri turns an HTTP 402 Payment Required response into a signed, settled payment." },
  { to: "/docs/mcp", title: "MCP tools", body: "Expose payment capabilities to any MCP-compatible agent with typed tool schemas." },
  { to: "/docs/policies", title: "Policies", body: "Spend caps, allowlists, and per-agent budgets enforced before any transfer clears." },
  { to: "/docs/receipts", title: "Receipts", body: "Every payment produces a cryptographically verifiable, auditable receipt." },
  { to: "/docs/security", title: "Security", body: "Key custody, signing boundaries, and the trust model behind agent payments." },
];

export function DocsOverview() {
  useTitle("Docs · Overview — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Documentation"
        title="Build agents that can pay"
        intro="Capri AgentPay is the payment rail for autonomous agents. It implements the x402 standard, enforces spend policies, and produces signed receipts for every transaction — so your agents can transact without you handing over a credit card."
      />

      <DocsSection title="How it fits together">
        <p>
          An agent hits a resource that responds with HTTP 402. Capri intercepts the challenge, checks it against your
          policies, signs a payment authorization, settles it over the x402 rail, and returns a receipt. The agent
          retries the original request with proof of payment and gets its data.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <FileText size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">1 · Challenge</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">Server returns 402 with price and pay-to details.</p>
          </Card>
          <Card>
            <Wallet size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">2 · Authorize</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">Capri checks policy, then signs the payment.</p>
          </Card>
          <Card>
            <Server size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">3 · Settle</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">Payment clears and a receipt is issued.</p>
          </Card>
        </div>
      </DocsSection>

      <DocsSection title="Explore the docs">
        <div className="grid gap-3 sm:grid-cols-2">
          {map.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-card transition hover:border-black/25"
            >
              <span>
                <span className="flex items-center gap-2 font-sans text-sm font-semibold text-black">
                  <BookOpen size={15} className="text-slate-500" />
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.body}</span>
              </span>
              <ArrowRight size={16} className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-black" />
            </Link>
          ))}
        </div>
      </DocsSection>
    </div>
  );
}
