import { motion } from "framer-motion";
import {
  ArrowUpRight,
  KeyRound,
  Receipt,
  ShieldCheck,
  Wallet,
  Zap,
  Server,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { TopNav } from "../components/TopNav";
import { useWaitlist } from "../components/WaitlistProvider";
import { useBrand } from "../lib/useBrand";
import { useTitle } from "../lib/useTitle";

const flowSteps = [
  {
    title: "The agent makes a request",
    body: "The agent or SDK performs a normal HTTP request. A normal request stays normal.",
  },
  {
    title: "The endpoint answers 402",
    body: "The upstream API answers with HTTP 402: amount, asset, chain, and recipient.",
  },
  {
    title: "Policy decides",
    body: "AgentPay checks the merchant allowlist, per-transaction cap, and daily and monthly spend.",
  },
  {
    title: "The wallet signs and settles",
    body: "If approved, the signer produces payment proof. The agent never sees key material.",
  },
  {
    title: "Retry and receipt",
    body: "The original request is retried with proof, and a signed receipt is stored.",
  },
];

const productPillars = [
  {
    Icon: Wallet,
    title: "Give your agent a budget, not your keys.",
    body: "Amount, asset, chain, and recipient are checked before anything is signed. Auto-approve under your threshold; human prompt in VS Code above it.",
  },
  {
    Icon: KeyRound,
    title: "Agents get narrow tools, not custody.",
    body: "Keys live in VS Code SecretStorage. Agents get tools, never keys. The MCP server exposes six narrow payment tools.",
  },
  {
    Icon: Receipt,
    title: "Verify any payment after the fact.",
    body: "Every settled payment produces a verifiable, tamper-evident record: canonical JSON, locally signed, independently verifiable.",
  },
  {
    Icon: Zap,
    title: "One call. The paid path handles itself.",
    body: "When the endpoint returns 402, Capri AgentPay parses the requirement, checks the policy, signs only if allowed, retries once with proof headers, and stores the receipt.",
  },
];

function AgentPayHome() {
  const { open } = useWaitlist();

  return (
    <>
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              VS Code extension &middot; Sandbox preview
            </span>
            <h1 className="mt-6 font-sans text-4xl font-semibold tracking-display text-black sm:text-6xl">
              Give your agent a budget, not your keys.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Give AI agents a wallet with a budget. Capri AgentPay enforces spending policy, handles x402
              payment challenges, and signs a receipt for every payment &mdash; inside VS Code.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Run the interactive demo
                <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.04]"
              >
                Read the protocol docs
              </Link>
              <button
                type="button"
                onClick={() => open("home-hero")}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-black"
              >
                Install for VS Code
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <h2 className="mt-3 font-sans text-2xl font-semibold text-black sm:text-3xl">
              Policy first. Signing second. Receipt always.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Every payment moves through the same five steps, in the same order. There is no path where an
              agent reaches the wallet directly.
            </p>
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {flowSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-black/10 bg-ink p-5">
                <span className="font-mono text-xs text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-sans text-sm font-semibold text-black">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {productPillars.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-black/10 bg-white p-6 shadow-card">
                <Icon size={20} className="text-black" />
                <h3 className="mt-4 font-sans text-lg font-semibold text-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaitlistCta
        eyebrow="Access / queue"
        title="Try the demo, then request access."
        body="Capri AgentPay is developer preview software. Sandbox mode operates exclusively on the Base Sepolia test network with assets that have no monetary value; mainnet settlement is disabled by default and requires an explicit opt-in."
      />
    </>
  );
}

const capriPillars = [
  {
    Icon: Server,
    title: "Governed runtimes",
    body: "Execution layers that can pause, route, approve, and recover when an agent leaves the prompt and touches real systems.",
  },
  {
    Icon: Wallet,
    title: "Payment controls",
    body: "Wallet policy, budgets, signed receipts, and machine-payment primitives for MCP tools and paid APIs.",
  },
  {
    Icon: Wrench,
    title: "Operator surfaces",
    body: "Interfaces that keep humans in the loop without turning every autonomous workflow back into manual operations.",
  },
];

const audiences = [
  "Teams shipping MCP servers or paid toolchains",
  "Internal copilots with approval and audit requirements",
  "Product groups building operator surfaces for agent systems",
];

function CapriAiHome() {
  const { open } = useWaitlist();

  return (
    <>
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-slate-600">
              Tools for AI
            </span>
            <h1 className="mt-6 font-sans text-4xl font-semibold tracking-display text-black sm:text-6xl">
              We build tools for AI.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Capri AI builds governed runtimes, payment control layers, and operator-grade product surfaces
              for teams shipping agent systems in production.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => open("home-hero")}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Request access
                <ArrowUpRight size={16} />
              </button>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.04]"
              >
                View Capri AgentPay
              </Link>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-500">
              We care about the awkward parts of autonomy: approvals, budgets, receipts, execution boundaries,
              and the interfaces humans still need once an agent starts touching money or live systems.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {capriPillars.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-black/10 bg-ink p-6">
                <Icon size={20} className="text-black" />
                <h3 className="mt-4 font-sans text-lg font-semibold text-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-card">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Now shipping
            </span>
            <h2 className="mt-5 font-sans text-2xl font-semibold text-black">Capri AgentPay</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Capri AgentPay is the first product in the stack: governed MCP and x402 payments with policy
              checks, receipts, and review thresholds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Run the demo
                <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.04]"
              >
                Documentation
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Who it&apos;s for</p>
            <ul className="mt-4 space-y-3">
              {audiences.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-black" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              We are opening Capri AI to teams building paid tools, internal agent workflows, and operator
              surfaces that need more than a thin chat wrapper.
            </p>
          </div>
        </div>
      </section>

      <WaitlistCta
        eyebrow="Access / queue"
        title="Request access to Capri AI."
        body="Tell us who you are and what you are building. We are starting with a small set of teams that need governed execution, payment controls, or operator tooling around agents."
      />
    </>
  );
}

function WaitlistCta({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  const { open } = useWaitlist();
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-card sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-sans text-2xl font-semibold text-black sm:text-3xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">{body}</p>
          <button
            type="button"
            onClick={() => open("home-cta")}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
          >
            Join waitlist
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const brand = useBrand();
  useTitle(
    brand.id === "capri-ai"
      ? "Capri AI | We build tools for AI"
      : "Capri AgentPay | Governed payments for AI agents"
  );

  return (
    <div className="min-h-screen bg-ink text-coin">
      <TopNav />
      {brand.id === "capri-ai" ? <CapriAiHome /> : <AgentPayHome />}
      <SiteFooter />
    </div>
  );
}
