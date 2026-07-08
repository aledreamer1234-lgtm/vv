import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { WaitlistProvider } from "./components/WaitlistProvider";
import { DocsLayout } from "./layouts/DocsLayout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { NotFound } from "./pages/NotFound";
import { DocsOverview } from "./pages/docs/Overview";
import { DocsQuickstart } from "./pages/docs/Quickstart";
import { DocsX402 } from "./pages/docs/X402";
import { DocsMcp } from "./pages/docs/Mcp";
import { DocsPolicies } from "./pages/docs/Policies";
import { DocsReceipts } from "./pages/docs/Receipts";
import { DocsSecurity } from "./pages/docs/Security";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <WaitlistProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsOverview />} />
          <Route path="quickstart" element={<DocsQuickstart />} />
          <Route path="x402" element={<DocsX402 />} />
          <Route path="mcp" element={<DocsMcp />} />
          <Route path="policies" element={<DocsPolicies />} />
          <Route path="receipts" element={<DocsReceipts />} />
          <Route path="security" element={<DocsSecurity />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WaitlistProvider>
  );
}
