import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { MOCK_INVESTMENTS } from "~/lib/mock-data";
import type { Investment } from "~/lib/mock-data";
import { useState } from "react";
import { Search, Info, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user, investments: MOCK_INVESTMENTS };
}

type ComplianceRating = Investment["complianceRating"];

function RatingBadge({ rating }: { rating: ComplianceRating }) {
  const map: Record<ComplianceRating, { className: string; label: string }> = {
    "Fully Compliant": { className: "badge-halal", label: "Fully Compliant" },
    "Conditionally Compliant": { className: "badge-mashbooh", label: "Conditionally Compliant" },
    "Non-Compliant": { className: "badge-haram", label: "Non-Compliant" },
  };
  const entry = map[rating];
  return <span className={entry.className}>{entry.label}</span>;
}

function CriterionBar({
  label,
  value,
  threshold,
  lowerIsBetter = true,
}: {
  label: string;
  value: number;
  threshold: number;
  lowerIsBetter?: boolean;
}) {
  const passes = lowerIsBetter ? value < threshold : value > threshold;
  const fillPercent = Math.min((value / (threshold * 2)) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: "#5A6B7B" }}>{label}</span>
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-bold"
            style={{ color: passes ? "#27AE60" : "#C0392B" }}
          >
            {value.toFixed(1)}%
          </span>
          <span className="text-xs" style={{ color: "#5A6B7B" }}>
            (max {threshold}%)
          </span>
          {passes ? (
            <CheckCircle size={12} color="#27AE60" />
          ) : (
            <XCircle size={12} color="#C0392B" />
          )}
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E8E4DC" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${fillPercent}%`,
            background: passes ? "#27AE60" : "#C0392B",
          }}
        />
      </div>
    </div>
  );
}

function InvestmentDetail({ inv, onClose }: { inv: Investment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: "#E8E4DC" }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-lg font-bold" style={{ color: "#1A6B4A" }}>
                {inv.ticker}
              </span>
              <RatingBadge rating={inv.complianceRating} />
            </div>
            <h2
              className="font-bold text-xl"
              style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
            >
              {inv.name}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#5A6B7B" }}>
              {inv.sector}{inv.marketCap ? ` · ${inv.marketCap}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <X size={16} style={{ color: "#5A6B7B" }} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Shariah criteria */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#5A6B7B" }}>
              Shariah Screening Criteria
            </p>
            <div className="space-y-3">
              <CriterionBar
                label="Revenue from Haram Activities"
                value={inv.revenueFromHaram}
                threshold={5}
              />
              <CriterionBar
                label="Debt-to-Assets Ratio"
                value={inv.debtToAssets}
                threshold={33}
              />
              <CriterionBar
                label="Interest (Riba) Income"
                value={inv.interestIncome}
                threshold={33}
              />
            </div>
          </div>

          {/* Verdict */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background:
                inv.complianceRating === "Fully Compliant"
                  ? "#D5F4E6"
                  : inv.complianceRating === "Non-Compliant"
                  ? "#FADBD8"
                  : "#FDEBD0",
              borderColor:
                inv.complianceRating === "Fully Compliant"
                  ? "#27AE60"
                  : inv.complianceRating === "Non-Compliant"
                  ? "#C0392B"
                  : "#E67E22",
            }}
          >
            {inv.complianceRating === "Fully Compliant" && (
              <div className="flex items-start gap-2">
                <CheckCircle size={16} color="#27AE60" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1A6B4A" }}>
                    Fully Shariah-Compliant Investment
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#1A6B4A" }}>
                    All screening criteria met. Halal to invest without purification.
                  </p>
                </div>
              </div>
            )}
            {inv.complianceRating === "Conditionally Compliant" && (
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} color="#E67E22" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#B8600E" }}>
                    Conditionally Compliant — Purification Required
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#B8600E" }}>
                    {inv.purificationAmount?.toFixed(2)}% of dividends must be donated to charity
                    (purification/tazkiyah) before the return is Halal.
                  </p>
                </div>
              </div>
            )}
            {inv.complianceRating === "Non-Compliant" && (
              <div className="flex items-start gap-2">
                <XCircle size={16} color="#C0392B" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#C0392B" }}>
                    Non-Compliant — Investment Prohibited (Haram)
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#C0392B" }}>
                    This instrument fails one or more Shariah criteria. Investment is not permitted.
                    Divest any existing holdings immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvestmentsPage() {
  const { investments } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<ComplianceRating | "All">("All");
  const [selectedInv, setSelectedInv] = useState<Investment | null>(null);

  const filtered = investments.filter((inv) => {
    const matchSearch =
      !searchQuery ||
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRating = ratingFilter === "All" || inv.complianceRating === ratingFilter;
    return matchSearch && matchRating;
  });

  const fullCount = investments.filter((i) => i.complianceRating === "Fully Compliant").length;
  const condCount = investments.filter((i) => i.complianceRating === "Conditionally Compliant").length;
  const nonCount = investments.filter((i) => i.complianceRating === "Non-Compliant").length;

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Halal Investment Screener
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
            Screen stocks, funds, and instruments against AAOIFI Shariah criteria. Revenue &lt;5%, Debt-to-Assets &lt;33%, Interest Income &lt;33%.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All Instruments", value: "All", count: investments.length },
            { label: "Fully Compliant", value: "Fully Compliant", count: fullCount },
            { label: "Conditionally Compliant", value: "Conditionally Compliant", count: condCount },
            { label: "Non-Compliant", value: "Non-Compliant", count: nonCount },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setRatingFilter(pill.value as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border"
              style={{
                background: ratingFilter === pill.value ? "#1A6B4A" : "#FFFFFF",
                color: ratingFilter === pill.value ? "#FFFFFF" : "#5A6B7B",
                borderColor: ratingFilter === pill.value ? "#1A6B4A" : "#E8E4DC",
              }}
            >
              {pill.label}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: ratingFilter === pill.value ? "rgba(255,255,255,0.25)" : "#F0EDE5",
                  color: ratingFilter === pill.value ? "white" : "#1A1A2E",
                }}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#5A6B7B" }} />
          <input
            type="text"
            placeholder="Search by name, ticker, or sector..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm bg-white"
            style={{ borderColor: "#E8E4DC", color: "#1A1A2E", outline: "none" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Investment table */}
        <div className="azhar-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8F6F1" }}>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Ticker</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Name & Sector</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Haram Rev.</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Debt/Assets</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Interest Inc.</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Rating</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#E8E4DC", background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAF8" }}
                  >
                    <td className="px-5 py-3 font-mono font-bold" style={{ color: "#1A6B4A" }}>
                      {inv.ticker}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium" style={{ color: "#1A1A2E" }}>{inv.name}</p>
                      <p className="text-xs" style={{ color: "#5A6B7B" }}>{inv.sector}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className="text-xs font-bold"
                        style={{ color: inv.revenueFromHaram < 5 ? "#27AE60" : "#C0392B" }}
                      >
                        {inv.revenueFromHaram.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className="text-xs font-bold"
                        style={{ color: inv.debtToAssets < 33 ? "#27AE60" : "#C0392B" }}
                      >
                        {inv.debtToAssets.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className="text-xs font-bold"
                        style={{ color: inv.interestIncome < 33 ? "#27AE60" : "#C0392B" }}
                      >
                        {inv.interestIncome.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <RatingBadge rating={inv.complianceRating} />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelectedInv(inv)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                        style={{ borderColor: "#E8E4DC", color: "#1A6B4A" }}
                      >
                        Screen
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm" style={{ color: "#5A6B7B" }}>
                      No instruments match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: "#E8E4DC", background: "#F8F6F1" }}>
          <Info size={14} style={{ color: "#5A6B7B", flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs" style={{ color: "#5A6B7B" }}>
            <strong>Screening criteria (AAOIFI SS-21):</strong> Revenue from Haram activities &lt;5% · Debt-to-total assets &lt;33% ·
            Interest &amp; non-compliant income &lt;33%. Conditionally compliant instruments require dividend purification
            (tazkiyah) proportional to Haram revenue share. All data shown is indicative — verify with certified Shariah advisors.
          </p>
        </div>
      </div>

      {selectedInv && (
        <InvestmentDetail inv={selectedInv} onClose={() => setSelectedInv(null)} />
      )}
    </DashboardShell>
  );
}
