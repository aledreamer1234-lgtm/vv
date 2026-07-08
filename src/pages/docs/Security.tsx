import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useTitle } from "../../lib/useTitle";
import { Card, DocsHeader, DocsSection } from "../../components/docs/DocsUI";

export function DocsSecurity() {
  useTitle("Docs · Security — Capri AgentPay");
  return (
    <div>
      <DocsHeader
        eyebrow="Trust model"
        title="Security and key custody"
        intro="Agents should be able to spend without ever holding your keys. Capri keeps signing authority on a boundary you control, so a compromised agent can never exceed its policy or exfiltrate a secret."
      />

      <DocsSection title="Where keys live">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <KeyRound size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">Never in the agent</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Agents receive scoped session tokens, not signing keys. Keys stay in the Capri signer.
            </p>
          </Card>
          <Card>
            <Lock size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">Policy-bound signing</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              The signer refuses to authorize anything a policy has not explicitly allowed.
            </p>
          </Card>
          <Card>
            <ShieldCheck size={18} className="text-black" />
            <p className="mt-3 font-sans text-sm font-semibold text-black">Nonce replay protection</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Each payment is bound to a single-use nonce, so a captured proof cannot be reused.
            </p>
          </Card>
        </div>
      </DocsSection>

      <DocsSection title="Threat model">
        <p>
          Capri assumes an agent can be tricked into requesting a malicious resource. Because signing is gated by
          policy and scoped tokens expire quickly, the blast radius of a compromised agent is capped at its remaining
          budget — never your full wallet. Revoke a token to stop an agent instantly; in-flight settlements still
          produce receipts for the audit trail.
        </p>
      </DocsSection>

      <DocsSection title="Reporting issues">
        <p>
          Found a vulnerability? Email <span className="font-mono text-black">security@capri.dev</span>. We
          acknowledge reports within one business day.
        </p>
      </DocsSection>
    </div>
  );
}
