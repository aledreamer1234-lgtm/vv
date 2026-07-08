import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useBrand } from "../lib/useBrand";
import { useWaitlist } from "./WaitlistProvider";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/demo", label: "Demo", end: false },
  { to: "/docs", label: "Docs", end: false },
];

export function TopNav() {
  const brand = useBrand();
  const { open } = useWaitlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label={`${brand.name} home`}
          onClick={() => setMenuOpen(false)}
        >
          <img src="/capri-mark.svg" alt="" className="h-9 w-9 rounded-lg" />
          <span className="flex flex-col leading-tight">
            <span className="font-sans text-sm font-semibold text-black">{brand.name}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {brand.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-black/[0.06] text-black" : "text-slate-600 hover:bg-black/[0.04] hover:text-black"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => open("top-nav")}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
          >
            Join waitlist
          </button>
        </div>

        <button
          type="button"
          className="rounded-lg border border-black/10 p-2 text-slate-700 transition hover:bg-black/[0.04] md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-black/10 bg-ink px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive ? "bg-black/[0.06] text-black" : "text-slate-600 hover:bg-black/[0.04] hover:text-black"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                open("top-nav-mobile");
              }}
              className="mt-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
            >
              Join waitlist
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
