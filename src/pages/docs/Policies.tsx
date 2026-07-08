import { useTitle } from "../../lib/useTitle";
import { CodeBlock, DocsHeader, DocsSection, FieldTable } from "../../components/docs/DocsUI";

export function DocsPolicies() {
  useTitle("Docs · Policies — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Controls"
        title="Spend policies"
        intro="Policies are the guardrails that decide whether a payment is allowed before any value moves. Define budgets, allowlists, and per-request caps, and Capri enforces them on every call."
      />

      <DocsSection title="Define a policy">
        <p>Attach limits to a named policy and reference it by name from your agents.</p>
        <CodeBlock label="policy.ts">{`await pay.policies.create({
  name: "research-agent",
  perRequestMax: { value: "0.50", currency: "USDC" },
  dailyMax: { value: "20.00", currency: "USDC" },
  allow: ["api.example.com", "*.data.dev"],
  requireReceipt: true,
});`}</CodeBlock>
      </DocsSection>

      <DocsSection title="Policy fields">
        <FieldTable
          rows={[
            { field: "perRequestMax", type: "money", description: "Hard ceiling for any single payment." },
            { field: "dailyMax", type: "money", description: "Rolling 24-hour budget across all requests." },
            { field: "allow", type: "string[]", description: "Domains the agent is permitted to pay." },
            { field: "requireReceipt", type: "boolean", description: "Reject settlements that cannot produce a receipt." },
          ]}
        />
      </DocsSection>

      <DocsSection title="Enforcement order">
        <p>
          Every request is checked against the allowlist, then the per-request cap, then the remaining daily budget. If
          any check fails, the payment is refused and the original request is never retried — your funds never leave
          without passing all three gates.
        </p>
      </DocsSection>
    </div>
  );
}
