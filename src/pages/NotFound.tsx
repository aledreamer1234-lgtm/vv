import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { TopNav } from "../components/TopNav";
import { useTitle } from "../lib/useTitle";

export function NotFound() {
  useTitle("Page not found | Capri AI");
  return (
    <div className="flex min-h-screen flex-col bg-ink text-coin">
      <TopNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-4 font-sans text-3xl font-semibold tracking-display text-black sm:text-4xl">
          This page does not exist.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
          The page you are looking for may have moved. Head back home or open the documentation.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
          >
            Home
          </Link>
          <Link
            to="/docs"
            className="rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black/[0.04]"
          >
            Documentation
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
