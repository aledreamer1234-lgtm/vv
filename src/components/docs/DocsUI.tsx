import type { ReactNode } from "react";

export function DocsHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: ReactNode }) {
  return (
    <header className="border-b border-black/10 pb-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      <h1 className="mt-3 font-sans text-3xl font-semibold tracking-display text-black sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{intro}</p>
    </header>
  );
}

export function DocsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-sans text-xl font-semibold text-black">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-black/10 bg-white p-5 shadow-card ${className}`}>{children}</div>
  );
}

export function CodeBlock({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-card">
      {label ? (
        <div className="border-b border-black/10 bg-black/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-black">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function FieldTable({
  rows,
}: {
  rows: Array<{ field: string; type: string; description: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-card">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/[0.03] font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
            <th className="px-4 py-3 font-medium">Field</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.field} className="border-b border-black/[0.06] last:border-0 align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-black">{row.field}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-slate-500">{row.type}</td>
              <td className="px-4 py-3 text-slate-600">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
