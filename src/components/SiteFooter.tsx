import { Link } from "react-router-dom";
import { useBrand } from "../lib/useBrand";

const productLinks = [
  { to: "/", label: "Overview" },
  { to: "/demo", label: "Interactive demo" },
  { to: "/docs", label: "Documentation" },
];

const docsLinks = [
  { to: "/docs/quickstart", label: "Quickstart" },
  { to: "/docs/x402", label: "x402" },
  { to: "/docs/mcp", label: "MCP tools" },
  { to: "/docs/security", label: "Security" },
];

export function SiteFooter() {
  const brand = useBrand();

  return (
    <footer className="border-t border-black/10 bg-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/capri-mark.svg" alt="" className="h-9 w-9 rounded-lg" />
            <span className="font-sans text-sm font-semibold text-black">{brand.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            Capri AI builds governed runtimes, payment control layers, and operator-grade product surfaces for
            teams shipping agent systems in production.
          </p>
          <p className="mt-6 font-mono text-xs text-slate-500">Capri AI &copy; 2026</p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Product</h3>
          <ul className="mt-4 space-y-2">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-slate-600 transition hover:text-black">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Documentation</h3>
          <ul className="mt-4 space-y-2">
            {docsLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-slate-600 transition hover:text-black">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
