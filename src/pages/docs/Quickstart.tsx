import { useTitle } from "../../lib/useTitle";
import { Card, CodeBlock, DocsHeader, DocsSection } from "../../components/docs/DocsUI";

export function DocsQuickstart() {
  useTitle("Docs · Quickstart — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Quickstart"
        title="Your first agent payment"
        intro="Go from zero to a settled x402 payment. This guide assumes a Node 18+ environment and an agent runtime you control."
      />

      <DocsSection title="1 · Install">
        <p>Add the Capri AgentPay SDK to your project.</p>
        <CodeBlock label="terminal">{`npm install @capri/agentpay`}</CodeBlock>
      </DocsSection>

      <DocsSection title="2 · Initialize the client">
        <p>Create a client with your API key and the wallet you want agents to spend from.</p>
        <CodeBlock label="agent.ts">{`import { AgentPay } from "@capri/agentpay";

const pay = new AgentPay({
  apiKey: process.env.CAPRI_API_KEY!,
  wallet: process.env.CAPRI_WALLET_ID!,
});`}</CodeBlock>
      </DocsSection>

      <DocsSection title="3 · Wrap your fetch">
        <p>
          Wrap any request in <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-black">pay.fetch</code>.
          When the origin answers with 402, Capri handles the handshake and retries automatically.
        </p>
        <CodeBlock label="agent.ts">{`const res = await pay.fetch("https://api.example.com/report", {
  policy: "research-agent",
  maxAmount: { value: "0.50", currency: "USDC" },
});

const data = await res.json();
console.log(res.headers.get("x-capri-receipt")); // rcpt_...`}</CodeBlock>
      </DocsSection>

      <DocsSection title="4 · Verify the receipt">
        <p>Every settled call returns a receipt id you can look up or verify offline.</p>
        <CodeBlock label="agent.ts">{`const receipt = await pay.receipts.get(receiptId);
console.log(receipt.status); // "settled"`}</CodeBlock>
        <Card>
          <p className="font-sans text-sm font-semibold text-black">That&apos;s it</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Your agent can now pay for metered APIs on its own, within the caps you set. Next, tighten the guardrails in
            Policies or expose payments to other agents via MCP tools.
          </p>
        </Card>
      </DocsSection>
    </div>
  );
}
