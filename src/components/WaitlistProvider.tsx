import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useBrand } from "../lib/useBrand";

type WaitlistContextValue = {
  open: (source?: string) => void;
  close: () => void;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within a WaitlistProvider");
  return ctx;
}

type Status = "idle" | "submitting" | "done" | "error";

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const brand = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("unknown");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const open = useCallback((nextSource = "unknown") => {
    setSource(nextSource);
    setStatus("idle");
    setError(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<WaitlistContextValue>(() => ({ open, close }), [open, close]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          name: String(data.get("name") ?? ""),
          company: String(data.get("company") ?? ""),
          productInterest: brand.name,
          source,
          hostname: window.location.hostname,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not submit the waitlist form.");
      }

      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit the waitlist form.");
    }
  }

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Join the Capri AI waitlist"
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-card sm:p-8"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Access / queue</p>
                  <h2 className="mt-2 font-sans text-2xl font-semibold text-black">Request access</h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-black/10 p-2 text-slate-500 transition hover:bg-black/[0.04] hover:text-black"
                  aria-label="Close waitlist form"
                >
                  <X size={16} />
                </button>
              </div>

              {status === "done" ? (
                <div className="mt-6 rounded-xl border border-black/10 bg-black/[0.03] p-6">
                  <h3 className="font-sans text-lg font-semibold text-black">You&apos;re on the list.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    We stored your request and will reach out as Capri AI opens access for the next wave of
                    teams.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    Tell us who you are and what you are building. We are starting with a small set of teams
                    that need governed execution, payment controls, or operator tooling around agents.
                  </p>
                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-black">Email</span>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black/40"
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-black">Name</span>
                        <input
                          name="name"
                          type="text"
                          placeholder="Ava Chen"
                          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black/40"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-black">Company</span>
                        <input
                          name="company"
                          type="text"
                          placeholder="Capri Labs"
                          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black/40"
                        />
                      </label>
                    </div>

                    {status === "error" && error ? (
                      <p className="rounded-lg border border-black/15 bg-black/[0.03] px-3 py-2 text-sm text-black">
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-60"
                    >
                      {status === "submitting" ? "Submitting..." : "Join waitlist"}
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      We review requests manually and prioritize teams shipping real agent systems.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </WaitlistContext.Provider>
  );
}
