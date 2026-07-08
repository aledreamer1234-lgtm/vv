export type BrandId = "capri-ai" | "agentpay";

export type Brand = {
  id: BrandId;
  name: string;
  tagline: string;
  home: string;
};

const CAPRI_AI: Brand = {
  id: "capri-ai",
  name: "Capri AI",
  tagline: "We build tools for AI",
  home: "https://capriai.dev",
};

const AGENTPAY: Brand = {
  id: "agentpay",
  name: "Capri AgentPay",
  tagline: "Governed payments for AI agents",
  home: "https://agentpay.capriai.dev",
};

/**
 * Mirrors the brand detection in index.html. The same build is served from
 * capriai.dev (parent brand) and agentpay.capriai.dev (product). A `?site=`
 * query param can force a brand for local development and previews.
 */
export function detectBrand(): Brand {
  if (typeof window === "undefined") return AGENTPAY;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("site");
  const host = window.location.hostname.toLowerCase();
  const isParent =
    override === "capri-ai" || (!override && (host === "capriai.dev" || host === "www.capriai.dev"));
  return isParent ? CAPRI_AI : AGENTPAY;
}

export const brands = { CAPRI_AI, AGENTPAY };
