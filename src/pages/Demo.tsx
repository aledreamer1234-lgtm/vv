import { useCallback, useMemo, useRef, useState } from "react";
import {
  CircleCheck,
  CircleX,
  Clock,
  Play,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { SiteFooter } from "../components/SiteFooter";
import { TopNav } from "../components/TopNav";
import { useTitle } from "../lib/useTitle";

type EventLevel = "info" | "success" | "warning" | "error";
type LogEntry = { id: number; label: string; detail: string; level: EventLevel };
type Decision = "idle" | "auto-approve" | "needs-review" | "denied" | "settled";

type Receipt = {
  receiptId: string;
  agentId: string;
  merchant: string;
  amount: string;
  asset: string;
  chain: string;
  decision: string;
  settlement: string;
  timestamp: string;
};

const AGENT_ID = "agent_772b";
const CHAIN = "base-sepolia";
const ASSET = "USDC";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function fakeHash(prefix: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
  return `${prefix}_${hex}`;
}

export function Demo() {
  useTitle("Capri AgentPay Demo | Mock x402 payment flow");

  const [requestedAmount, setRequestedAmount] = useState("0.05");
  const [perTxCap, setPerTxCap] = useState("0.50");
  const [approvalThreshold, setApprovalThreshold] = useState("0.10");
  const [merchant, setMerchant] = useState("https://api.example.com");
  const [allowlist, setAllowlist] = useState("https://api.example.com");
  const [endpoint, setEndpoint] = useState("https://api.example.com/premium-data");

  const [balance, setBalance] = useState(5);
  const [dailyRemaining, setDailyRemaining] = useState(2);

  const [events, setEvents] = useState<LogEntry[]>([]);
  const [decision, setDecision] = useState<Decision>("idle");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [running, setRunning] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  const eventId = useRef(0);
  const resolveApproval = useRef<((approved: boolean) => void) | null>(null);

  const pushEvent = useCallback((label: string, detail: string, level: EventLevel = "info") => {
    eventId.current += 1;
    setEvents((prev) => [...prev, { id: eventId.current, label, detail, level }]);
  }, []);

  const reset = useCallback(() => {
    setEvents([]);
    setDecision("idle");
    setReceipt(null);
    setRunning(false);
    setAwaitingApproval(false);
    setBalance(5);
    setDailyRemaining(2);
    resolveApproval.current = null;
  }, []);

  const awaitHumanReview = useCallback(() => {
    setAwaitingApproval(true);
    return new Promise<boolean>((resolve) => {
      resolveApproval.current = resolve;
    });
  }, []);

  const handleApproval = useCallback((approved: boolean) => {
    setAwaitingApproval(false);
    resolveApproval.current?.(approved);
    resolveApproval.current = null;
  }, []);

  const run = useCallback(async () => {
    const amount = Number(requestedAmount);
    const cap = Number(perTxCap);
    const threshold = Number(approvalThreshold);
    const allowed = allowlist
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    setRunning(true);
    setEvents([]);
    setReceipt(null);
    setDecision("idle");
    eventId.current = 0;

    pushEvent("Agent request", `GET ${endpoint}`, "info");
    await delay(500);

    pushEvent("HTTP 402 Payment Required", `${amount.toFixed(2)} ${ASSET} on ${CHAIN}`, "warning");
    await delay(500);

    pushEvent("Validated requirements", "Amount, asset, chain, and recipient parsed from the challenge.", "info");
    await delay(450);

    // Hard-deny checks run before spend-window math.
    if (allowed.length > 0 && !allowed.includes(merchant)) {
      pushEvent("Merchant outside allowlist", "Deny before spend-window math.", "error");
      setDecision("denied");
      setRunning(false);
      return;
    }
    pushEvent("Merchant allowlisted", merchant, "success");
    await delay(400);

    if (amount > cap) {
      pushEvent("Above per-transaction cap", `Denied: ${amount.toFixed(2)} exceeds ${cap.toFixed(2)} cap.`, "error");
      setDecision("denied");
      setRunning(false);
      return;
    }

    if (amount > dailyRemaining) {
      pushEvent("Daily budget exhausted", `Denied: ${amount.toFixed(2)} exceeds ${dailyRemaining.toFixed(2)} remaining.`, "error");
      setDecision("denied");
      setRunning(false);
      return;
    }

    // Approval threshold semantics: human review only runs after hard-deny checks pass.
    if (amount > threshold) {
      pushEvent("Amount requires human approval", `Above ${threshold.toFixed(2)} approval threshold.`, "warning");
      setDecision("needs-review");
      const approved = await awaitHumanReview();
      if (!approved) {
        pushEvent("Human approval dismissed", "Deny and record the pending intent.", "error");
        setDecision("denied");
        setRunning(false);
        return;
      }
      pushEvent("Human approved", "Reviewer approved the payment in VS Code.", "success");
    } else {
      pushEvent("Within policy", `Auto-approved under ${threshold.toFixed(2)} threshold.`, "success");
      setDecision("auto-approve");
    }
    await delay(450);

    const proof = fakeHash("proof", `${endpoint}:${amount}:${merchant}`);
    pushEvent("Proof signed", `Payment proof ${proof} produced by the runtime signer.`, "success");
    await delay(450);

    const settlement = fakeHash("tx", `${proof}:${CHAIN}`);
    pushEvent("Mock settlement", `Settled on ${CHAIN}: ${settlement}`, "success");
    await delay(450);

    pushEvent("Retry with proof", `Original request replayed once with ${proof} attached.`, "info");
    await delay(450);

    const receiptId = fakeHash("rcpt", `${settlement}:${AGENT_ID}`);
    const record: Receipt = {
      receiptId,
      agentId: AGENT_ID,
      merchant,
      amount: `${amount.toFixed(2)} ${ASSET}`,
      asset: ASSET,
      chain: CHAIN,
      decision: amount > threshold ? "approved (human review)" : "approved (auto)",
      settlement,
      timestamp: new Date().toISOString(),
    };
    setReceipt(record);
    setBalance((prev) => Number((prev - amount).toFixed(2)));
    setDailyRemaining((prev) => Number((prev - amount).toFixed(2)));
    pushEvent("Signed receipt stored", `Receipt ${receiptId} written to the audit log.`, "success");
    setDecision("settled");
    setRunning(false);
  }, [
    requestedAmount,
    perTxCap,
    approvalThreshold,
    merchant,
    allowlist,
    endpoint,
    dailyRemaining,
    awaitHumanReview,
    pushEvent,
  ]);

  const decisionBadge = useMemo(() => {
    switch (decision) {
      case "auto-approve":
        return { label: "Auto approve", className: "border-black/20 bg-black/[0.05] text-black", Icon: CircleCheck };
      case "needs-review":
        return { label: "Needs review", className: "border-black/20 bg-black/[0.05] text-black", Icon: TriangleAlert };
      case "denied":
        return { label: "Policy denied", className: "border-black/30 bg-black/[0.08] text-black", Icon: CircleX };
      case "settled":
        return { label: "Signed receipt", className: "border-black/20 bg-black/[0.05] text-black", Icon: ShieldCheck };
      default:
        return { label: "Waiting for demo run...", className: "border-black/10 bg-white text-slate-500", Icon: Clock };
    }
  }, [decision]);

  return (
    <div className="min-h-screen bg-ink text-coin">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Interactive demo</p>
          <h1 className="mt-3 font-sans text-3xl font-semibold tracking-display text-black sm:text-4xl">
            Simulate a Capri AgentPay MCP payment from HTTP 402 to receipt-backed retry.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Run a fully local Capri AgentPay simulation from HTTP 402 challenge through policy evaluation,
            review, mock settlement, signed receipt, and retry.
          </p>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-card">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-black" />
            <p className="text-xs leading-relaxed text-slate-600">
              This is a client-side-only simulation. It uses local state, mocked delays, deterministic fake
              hashes, and no backend, wallet, chain, or network calls.
            </p>
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="space-y-6">
            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-lg font-semibold text-black">Demo inputs</h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Local sandbox counters
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Change these before running to force auto-approval, human review, or denial.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Requested amount" hint="Requested payment in USDC.">
                  <input
                    value={requestedAmount}
                    onChange={(event) => setRequestedAmount(event.target.value)}
                    inputMode="decimal"
                    className="demo-input"
                  />
                </Field>
                <Field label="Per-transaction cap" hint="Single payment cap.">
                  <input
                    value={perTxCap}
                    onChange={(event) => setPerTxCap(event.target.value)}
                    inputMode="decimal"
                    className="demo-input"
                  />
                </Field>
                <Field label="Approval threshold" hint="Prompt threshold.">
                  <input
                    value={approvalThreshold}
                    onChange={(event) => setApprovalThreshold(event.target.value)}
                    inputMode="decimal"
                    className="demo-input"
                  />
                </Field>
                <Field label="Merchant origin" hint="Merchant settlement origin.">
                  <input
                    value={merchant}
                    onChange={(event) => setMerchant(event.target.value)}
                    className="demo-input"
                  />
                </Field>
                <Field label="Merchant allowlist" hint="Allowed merchant origins.">
                  <input
                    value={allowlist}
                    onChange={(event) => setAllowlist(event.target.value)}
                    className="demo-input"
                  />
                </Field>
                <Field label="Protected endpoint" hint="Protected endpoint URL.">
                  <input
                    value={endpoint}
                    onChange={(event) => setEndpoint(event.target.value)}
                    className="demo-input"
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={run}
                  disabled={running || awaitingApproval}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-60"
                >
                  <Play size={16} />
                  {running || awaitingApproval ? "Running..." : "Run demo"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={running}
                  className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:opacity-60"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-black/10 bg-white p-5 shadow-card">
                <div className="flex items-center gap-2 text-slate-500">
                  <Wallet size={15} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em]">Wallet balance</span>
                </div>
                <p className="mt-3 font-sans text-2xl font-semibold text-black">
                  {balance.toFixed(2)} <span className="text-sm text-slate-500">{ASSET}</span>
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-5 shadow-card">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={15} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em]">Daily remaining</span>
                </div>
                <p className="mt-3 font-sans text-2xl font-semibold text-black">
                  {dailyRemaining.toFixed(2)} <span className="text-sm text-slate-500">{ASSET}</span>
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-lg font-semibold text-black">Policy decision</h2>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${decisionBadge.className}`}
                >
                  <decisionBadge.Icon size={13} />
                  {decisionBadge.label}
                </span>
              </div>

              {awaitingApproval ? (
                <div className="mt-4 rounded-xl border border-black/15 bg-black/[0.03] p-4">
                  <p className="text-sm font-medium text-black">Amount requires human approval</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Under your threshold it auto-approves. Over it, you get a prompt in VS Code.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleApproval(true)}
                      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                    >
                      Approve payment
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproval(false)}
                      className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.04]"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-card">
              <h2 className="font-sans text-lg font-semibold text-black">Event log</h2>
              <ol className="mt-4 space-y-2">
                {events.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-black/15 px-3 py-6 text-center font-mono text-xs text-slate-400">
                    Waiting for demo run...
                  </li>
                ) : (
                  events.map((event) => (
                    <li key={event.id} className="flex items-start gap-3 rounded-lg border border-black/[0.06] bg-ink px-3 py-2.5">
                      <LogIcon level={event.level} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black">{event.label}</p>
                        <p className="truncate font-mono text-xs text-slate-500">{event.detail}</p>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </div>

            {receipt ? (
              <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-card">
                <div className="border-b border-black/10 bg-black/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                  Signed receipt
                </div>
                <dl className="divide-y divide-black/[0.06]">
                  <ReceiptRow term="receipt.id" value={receipt.receiptId} />
                  <ReceiptRow term="agent.id" value={receipt.agentId} />
                  <ReceiptRow term="merchant" value={receipt.merchant} />
                  <ReceiptRow term="amount" value={receipt.amount} />
                  <ReceiptRow term="chain" value={receipt.chain} />
                  <ReceiptRow term="policy.decision" value={receipt.decision} />
                  <ReceiptRow term="settlement" value={receipt.settlement} />
                  <ReceiptRow term="timestamp" value={receipt.timestamp} />
                </dl>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-black">{label}</span>
      {children}
      <span className="mt-1 block font-mono text-[11px] text-slate-500">{hint}</span>
    </label>
  );
}

function LogIcon({ level }: { level: EventLevel }) {
  const size = 15;
  if (level === "success") return <CircleCheck size={size} className="mt-0.5 shrink-0 text-black" />;
  if (level === "warning") return <TriangleAlert size={size} className="mt-0.5 shrink-0 text-black" />;
  if (level === "error") return <CircleX size={size} className="mt-0.5 shrink-0 text-black" />;
  return <Clock size={size} className="mt-0.5 shrink-0 text-slate-500" />;
}

function ReceiptRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="font-mono text-xs text-slate-500">{term}</dt>
      <dd className="break-all text-right font-mono text-xs text-black">{value}</dd>
    </div>
  );
}
