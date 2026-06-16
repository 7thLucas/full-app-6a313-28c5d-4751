import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { useConfigurables } from "~/modules/configurables";
import { useState, useMemo } from "react";
import { Coins, Info, ChevronDown, ChevronUp, Calculator } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;

const ASSET_CATEGORIES = [
  { key: "gold", label: "Gold", unit: "grams", description: "Physical gold, gold savings, gold ETFs" },
  { key: "silver", label: "Silver", unit: "grams", description: "Physical silver, silver savings" },
  { key: "cash", label: "Cash & Bank Savings", unit: "USD", description: "Current & savings accounts, cash on hand" },
  { key: "trade", label: "Trade Goods & Inventory", unit: "USD", description: "Stock in trade, merchandise for sale" },
  { key: "business", label: "Business Assets (Net)", unit: "USD", description: "Net current assets of business" },
  { key: "investments", label: "Halal Investment Portfolio", unit: "USD", description: "Stocks, Sukuk, unit trusts" },
  { key: "receivables", label: "Money Owed to You", unit: "USD", description: "Trade receivables likely to be collected" },
];

const ASNAF_CATEGORIES = [
  { key: "faqir", label: "Al-Fuqara (The Poor)", percentage: 12.5 },
  { key: "miskin", label: "Al-Masakin (The Needy)", percentage: 12.5 },
  { key: "amil", label: "Al-'Amilin (Zakat Administrators)", percentage: 12.5 },
  { key: "muallaf", label: "Al-Mu'allafah (New Muslims)", percentage: 12.5 },
  { key: "riqab", label: "Ar-Riqab (Emancipation)", percentage: 12.5 },
  { key: "gharimin", label: "Al-Gharimin (Debtors)", percentage: 12.5 },
  { key: "fisabilillah", label: "Fi Sabilillah (Cause of Allah)", percentage: 12.5 },
  { key: "ibn_sabil", label: "Ibn As-Sabil (Travellers)", percentage: 12.5 },
];

export default function ZakatCalculatorPage() {
  const { config } = useConfigurables();

  const goldPrice = config?.niabGoldPricePerGram ?? 95;
  const silverPrice = config?.nisabSilverPricePerGram ?? 0.85;
  const zakatRate = (config?.zakatRate ?? 2.5) / 100;

  const [assets, setAssets] = useState<Record<string, number>>({
    gold: 0,
    silver: 0,
    cash: 0,
    trade: 0,
    business: 0,
    investments: 0,
    receivables: 0,
  });

  const [showDistribution, setShowDistribution] = useState(false);

  const goldValueUSD = assets.gold * goldPrice;
  const silverValueUSD = assets.silver * silverPrice;
  const otherValueUSD = assets.cash + assets.trade + assets.business + assets.investments + assets.receivables;
  const totalWealthUSD = goldValueUSD + silverValueUSD + otherValueUSD;

  const nisabGoldUSD = NISAB_GOLD_GRAMS * goldPrice;
  const nisabSilverUSD = NISAB_SILVER_GRAMS * silverPrice;
  const nisabThreshold = Math.min(nisabGoldUSD, nisabSilverUSD); // lower of the two (silver favours payers)

  const aboveNisab = totalWealthUSD >= nisabThreshold;
  const zakatAmount = aboveNisab ? totalWealthUSD * zakatRate : 0;

  return (
    <DashboardShell>
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Zakat Calculator
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
            Calculate Zakat obligation based on assets held for one Hawl (lunar year). Rate: {(zakatRate * 100).toFixed(1)}%
          </p>
        </div>

        {/* Nisab status panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="azhar-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
              Nisab — Gold (85g)
            </p>
            <p className="text-xl font-bold" style={{ color: "#C9A84C", fontFamily: "Playfair Display, Georgia, serif" }}>
              ${nisabGoldUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
              @ ${goldPrice}/gram
            </p>
          </div>
          <div className="azhar-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
              Nisab — Silver (595g)
            </p>
            <p className="text-xl font-bold" style={{ color: "#5A6B7B", fontFamily: "Playfair Display, Georgia, serif" }}>
              ${nisabSilverUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
              @ ${silverPrice}/gram
            </p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{
              background: aboveNisab ? "#D5F4E6" : "#F8F6F1",
              borderColor: aboveNisab ? "#27AE60" : "#E8E4DC",
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wider mb-1"
              style={{ color: aboveNisab ? "#1A6B4A" : "#5A6B7B" }}
            >
              Nisab Status
            </p>
            <p
              className="text-xl font-bold"
              style={{
                color: aboveNisab ? "#27AE60" : "#C0392B",
                fontFamily: "Playfair Display, Georgia, serif",
              }}
            >
              {aboveNisab ? "Above Nisab" : "Below Nisab"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: aboveNisab ? "#1A6B4A" : "#5A6B7B" }}>
              {aboveNisab
                ? "Zakat is obligatory for this wealth"
                : "Zakat not yet obligatory"}
            </p>
          </div>
        </div>

        {/* Asset inputs */}
        <div className="azhar-card p-5">
          <h2
            className="font-semibold text-base mb-5"
            style={{ color: "#1A1A2E" }}
          >
            Enter Your Zakatable Assets
          </h2>
          <div className="space-y-4">
            {ASSET_CATEGORIES.map((cat) => (
              <div key={cat.key} className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center py-3 border-b" style={{ borderColor: "#F0EDE5" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>
                    {cat.label}
                  </p>
                  <p className="text-xs" style={{ color: "#5A6B7B" }}>
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center border rounded-lg overflow-hidden bg-white" style={{ borderColor: "#E8E4DC" }}>
                  <span className="px-3 text-xs font-medium" style={{ color: "#5A6B7B", background: "#F8F6F1", height: "100%", display: "flex", alignItems: "center", padding: "10px 12px", borderRight: "1px solid #E8E4DC" }}>
                    {cat.unit}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="flex-1 px-3 py-2.5 text-sm bg-white outline-none"
                    style={{ color: "#1A1A2E" }}
                    value={assets[cat.key] || ""}
                    onChange={(e) =>
                      setAssets((prev) => ({ ...prev, [cat.key]: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="text-sm font-medium text-right" style={{ color: "#1A6B4A" }}>
                  {cat.key === "gold"
                    ? `≈ $${goldValueUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`
                    : cat.key === "silver"
                    ? `≈ $${silverValueUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`
                    : `$${(assets[cat.key] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-xl p-6 border"
          style={{
            background: aboveNisab ? "#0F3D2A" : "#F8F6F1",
            borderColor: aboveNisab ? "#1A6B4A" : "#E8E4DC",
          }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: aboveNisab ? "rgba(248,246,241,0.6)" : "#5A6B7B" }}
              >
                Total Zakatable Wealth
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color: aboveNisab ? "#C9A84C" : "#1A1A2E",
                  fontFamily: "Playfair Display, Georgia, serif",
                }}
              >
                ${totalWealthUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: aboveNisab ? "rgba(248,246,241,0.6)" : "#5A6B7B" }}
              >
                Zakat Due ({(zakatRate * 100).toFixed(1)}%)
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color: aboveNisab ? "#FFFFFF" : "#C0392B",
                  fontFamily: "Playfair Display, Georgia, serif",
                }}
              >
                ${zakatAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
              </p>
            </div>
          </div>

          {aboveNisab && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-xs" style={{ color: "rgba(248,246,241,0.7)" }}>
                Zakat is obligatory. The amount above represents 2.5% of your total zakatable wealth held
                for one complete Hawl (lunar year). Consult your local Shariah authority for dispensation to Asnaf.
              </p>
            </div>
          )}
        </div>

        {/* Zakat distribution by Asnaf */}
        {aboveNisab && (
          <div className="azhar-card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => setShowDistribution((v) => !v)}
            >
              <h2 className="font-semibold text-base" style={{ color: "#1A1A2E" }}>
                Suggested Zakat Distribution by Asnaf
              </h2>
              {showDistribution ? (
                <ChevronUp size={18} style={{ color: "#5A6B7B" }} />
              ) : (
                <ChevronDown size={18} style={{ color: "#5A6B7B" }} />
              )}
            </button>
            {showDistribution && (
              <div className="border-t px-5 pb-5" style={{ borderColor: "#E8E4DC" }}>
                <p className="text-xs mt-4 mb-4" style={{ color: "#5A6B7B" }}>
                  The eight categories (Asnaf) entitled to receive Zakat as defined in Surah At-Tawbah (9:60).
                  Equal distribution shown below — adjust with guidance from your Shariah board.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {ASNAF_CATEGORIES.map((asnaf) => (
                    <div
                      key={asnaf.key}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ borderColor: "#E8E4DC", background: "#F8F6F1" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>
                          {asnaf.label}
                        </p>
                        <p className="text-xs" style={{ color: "#5A6B7B" }}>
                          {asnaf.percentage}% share
                        </p>
                      </div>
                      <p className="text-sm font-bold" style={{ color: "#1A6B4A" }}>
                        ${((zakatAmount * asnaf.percentage) / 100).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informational note */}
        <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: "#E8E4DC", background: "#FDEBD0" }}>
          <Info size={16} style={{ color: "#E67E22", flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs" style={{ color: "#B8600E" }}>
            This calculator is provided as a guide. Zakat rulings may vary by madhab and jurisdiction.
            Always confirm your Zakat obligation with a qualified Shariah scholar or certified Islamic finance institution.
            Prices displayed are indicative — update Nisab gold and silver prices in App Settings.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
