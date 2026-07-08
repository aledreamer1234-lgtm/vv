import { useTitle } from "../../lib/useTitle";
import { CodeBlock, DocsHeader, DocsSection, FieldTable } from "../../components/docs/DocsUI";

export function DocsReceipts() {
  useTitle("Docs · Receipts — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Audit"
        title="Verifiable receipts"
        intro="Every settled payment produces a signed receipt. Receipts are the audit trail for autonomous spend — they can be verified offline and reconciled against your policies."
      />

      <DocsSection title="Receipt shape">
        <CodeBlock label="receipt.json">{`{
  "id": "rcpt_8f2a1c",
  "status": "settled",
  "agent": "research-agent",
  "amount": { "value": "0.05", "currency": "USDC" },
  "payTo": "0x9f3c...a12b",
  "resource": "https://api.example.com/report",
  "nonce": "4c1f9e2a",
  "settledAt": "2025-01-14T09:41:22Z",
  "signature": "0x3b7d...e91f"
}`}</CodeBlock>
      </DocsSection>

      <DocsSection title="Fields">
        <FieldTable
          rows={[
            { field: "id", type: "string", description: "Unique receipt identifier, prefixed rcpt_." },
            { field: "status", type: "enum", description: "One of pending, settled, or failed." },
            { field: "amount", type: "money", description: "Value transferred and its currency." },
            { field: "signature", type: "hex", description: "Signature over the receipt payload for offline verification." },
          ]}
        />
      </DocsSection>

      <DocsSection title="Verify offline">
        <p>Confirm a receipt without calling the API by checking its signature against the public key.</p>
        <CodeBlock label="verify.ts">{`import { verifyReceipt } from "@capri/agentpay";

const ok = verifyReceipt(receipt, publicKey);
if (!ok) throw new Error("Receipt failed verification");`}</CodeBlock>
      </DocsSection>
    </div>
  );
}
