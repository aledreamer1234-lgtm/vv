import { useTitle } from "../../lib/useTitle";
import { CodeBlock, DocsHeader, DocsSection, FieldTable } from "../../components/docs/DocsUI";

export function DocsX402() {
  useTitle("Docs · x402 — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Protocol"
        title="The x402 handshake"
        intro="x402 revives the long-reserved HTTP 402 Payment Required status code as a machine-readable payment challenge. Capri implements both sides of the exchange so your agents settle payments without human intervention."
      />

      <DocsSection title="The challenge">
        <p>
          When an agent requests a paid resource, the server responds with <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-black">402</code> and
          an <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-black">accept-payment</code> header describing what it wants.
        </p>
        <CodeBlock label="HTTP/1.1 402 Payment Required">{`HTTP/1.1 402 Payment Required
accept-payment: x402
x-price: 0.05 USDC
x-pay-to: 0x9f3c...a12b
x-network: base
x-nonce: 4c1f9e2a`}</CodeBlock>
      </DocsSection>

      <DocsSection title="Challenge fields">
        <FieldTable
          rows={[
            { field: "x-price", type: "string", description: "Amount and currency required to access the resource." },
            { field: "x-pay-to", type: "address", description: "Destination account that must receive the payment." },
            { field: "x-network", type: "string", description: "Settlement network for the transfer." },
            { field: "x-nonce", type: "string", description: "Single-use value that binds the payment to this request." },
          ]}
        />
      </DocsSection>

      <DocsSection title="The response">
        <p>
          Capri signs a payment authorization, settles it, and retries the request with an{" "}
          <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-black">x-payment</code> proof header.
          The server verifies the proof and returns the resource.
        </p>
        <CodeBlock label="retry request">{`GET /report HTTP/1.1
host: api.example.com
x-payment: eyJhbGciOiJFUzI1NiJ9...
x-nonce: 4c1f9e2a`}</CodeBlock>
      </DocsSection>
    </div>
  );
}
