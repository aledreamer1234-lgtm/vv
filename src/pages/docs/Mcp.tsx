import { useTitle } from "../../lib/useTitle";
import { CodeBlock, DocsHeader, DocsSection, FieldTable } from "../../components/docs/DocsUI";

export function DocsMcp() {
  useTitle("Docs · MCP tools — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Integration"
        title="MCP payment tools"
        intro="Capri ships a Model Context Protocol server so any MCP-compatible agent — Claude, Cursor, or your own runtime — can pay for resources through typed tools with policy enforcement baked in."
      />

      <DocsSection title="Register the server">
        <p>Point your MCP client at the Capri server. Tools are advertised automatically.</p>
        <CodeBlock label="mcp.json">{`{
  "mcpServers": {
    "capri-agentpay": {
      "command": "npx",
      "args": ["-y", "@capri/mcp"],
      "env": { "CAPRI_API_KEY": "sk_live_..." }
    }
  }
}`}</CodeBlock>
      </DocsSection>

      <DocsSection title="Available tools">
        <FieldTable
          rows={[
            { field: "pay_request", type: "tool", description: "Fetch a URL, settling any x402 challenge within policy limits." },
            { field: "quote_price", type: "tool", description: "Preview the price of a resource before committing to pay." },
            { field: "list_receipts", type: "tool", description: "Return recent receipts for the calling agent." },
            { field: "check_budget", type: "tool", description: "Report remaining spend against the active policy." },
          ]}
        />
      </DocsSection>

      <DocsSection title="Tool call example">
        <p>An agent invokes the tool with a natural argument shape; Capri handles signing and settlement.</p>
        <CodeBlock label="pay_request">{`{
  "name": "pay_request",
  "arguments": {
    "url": "https://api.example.com/dataset",
    "policy": "research-agent",
    "maxAmount": "0.50 USDC"
  }
}`}</CodeBlock>
      </DocsSection>
    </div>
  );
}
