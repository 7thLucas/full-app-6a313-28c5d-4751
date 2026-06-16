import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useSearchParams } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { MOCK_TRANSACTIONS } from "~/lib/mock-data";
import type { Transaction, ComplianceStatus } from "~/lib/mock-data";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Search,
  ChevronDown,
  X,
  Info,
} from "lucide-react";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user, transactions: MOCK_TRANSACTIONS };
}

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const map: Record<ComplianceStatus, string> = {
    Halal: "badge-halal",
    Haram: "badge-haram",
    Mashbooh: "badge-mashbooh",
  };
  return <span className={map[status]}>{status}</span>;
}

function TransactionDetail({ txn, onClose }: { txn: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: "#E8E4DC" }}>
          <div>
            <h2
              className="font-bold text-xl"
              style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Transaction Detail
            </h2>
            <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
              {txn.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ComplianceBadge status={txn.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <X size={16} style={{ color: "#5A6B7B" }} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Gregorian Date
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.date}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Hijri Date
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.hijriDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Amount
              </p>
              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>
                {txn.amount.toLocaleString()} {txn.currency}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Category
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.category}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Description
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.description}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Counterparty
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.counterparty}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                Branch
              </p>
              <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.branch}</p>
            </div>
          </div>

          {/* Compliance detail */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: txn.status === "Halal" ? "#D5F4E6" : txn.status === "Haram" ? "#FADBD8" : "#FDEBD0",
              borderColor: txn.status === "Halal" ? "#27AE60" : txn.status === "Haram" ? "#C0392B" : "#E67E22",
            }}
          >
            <div className="flex items-start gap-3">
              {txn.status === "Halal" && <CheckCircle size={18} color="#27AE60" />}
              {txn.status === "Haram" && <AlertTriangle size={18} color="#C0392B" />}
              {txn.status === "Mashbooh" && <HelpCircle size={18} color="#E67E22" />}
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{
                    color: txn.status === "Halal" ? "#1A6B4A" : txn.status === "Haram" ? "#C0392B" : "#B8600E",
                  }}
                >
                  {txn.status === "Halal"
                    ? "Transaction is Shariah-Compliant (Halal)"
                    : txn.status === "Haram"
                    ? "Transaction flagged: Haram activity detected"
                    : "Transaction doubtful (Mashbooh): Human review required"}
                </p>
                {txn.reasonCode && (
                  <p className="text-xs mt-1" style={{ color: "#5A6B7B" }}>
                    {txn.reasonCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fatwa reference */}
          {txn.fatwaNref && (
            <div className="rounded-xl p-4 border flex items-start gap-3" style={{ borderColor: "#E8E4DC", background: "#F8F6F1" }}>
              <Info size={16} style={{ color: "#5A6B7B", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: "#5A6B7B" }}>
                  Fatwa / Shariah Standard Reference
                </p>
                <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>{txn.fatwaNref}</p>
                <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
                  AAOIFI — Accounting & Auditing Organisation for Islamic Financial Institutions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { transactions } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "All">("All");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered = transactions.filter((txn) => {
    const matchesSearch =
      !searchQuery ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const haramCount = transactions.filter((t) => t.status === "Haram").length;
  const halalCount = transactions.filter((t) => t.status === "Halal").length;
  const mashboohCount = transactions.filter((t) => t.status === "Mashbooh").length;

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Transaction Compliance Screening
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
            Real-time Shariah compliance screening — all transactions vetted against Haram category database
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", count: transactions.length, status: "All" as const },
            { label: "Halal", count: halalCount, status: "Halal" as const },
            { label: "Haram", count: haramCount, status: "Haram" as const },
            { label: "Mashbooh", count: mashboohCount, status: "Mashbooh" as const },
          ].map((pill) => (
            <button
              key={pill.status}
              onClick={() => setStatusFilter(pill.status as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border"
              style={{
                background: statusFilter === pill.status ? "#1A6B4A" : "#FFFFFF",
                color: statusFilter === pill.status ? "#FFFFFF" : "#5A6B7B",
                borderColor: statusFilter === pill.status ? "#1A6B4A" : "#E8E4DC",
              }}
            >
              {pill.label}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: statusFilter === pill.status ? "rgba(255,255,255,0.25)" : "#F0EDE5",
                  color: statusFilter === pill.status ? "white" : "#1A1A2E",
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
            placeholder="Search by description, counterparty or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm bg-white"
            style={{ borderColor: "#E8E4DC", color: "#1A1A2E", outline: "none" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Transactions table */}
        <div className="azhar-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8F6F1" }}>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Date (Gregorian / Hijri)
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Description
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Branch
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#E8E4DC", background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAF8" }}
                  >
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "#5A6B7B" }}>
                      {txn.id}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium" style={{ color: "#1A1A2E" }}>{txn.date}</p>
                      <p className="text-xs" style={{ color: "#5A6B7B" }}>{txn.hijriDate}</p>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-medium text-xs truncate" style={{ color: "#1A1A2E" }}>
                        {txn.description}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#5A6B7B" }}>
                        {txn.counterparty}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs font-medium" style={{ color: "#1A1A2E" }}>
                      {txn.amount.toLocaleString()} {txn.currency}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "#5A6B7B" }}>
                      {txn.category}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "#5A6B7B" }}>
                      {txn.branch}
                    </td>
                    <td className="px-5 py-3">
                      <ComplianceBadge status={txn.status} />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                        style={{ borderColor: "#E8E4DC", color: "#1A6B4A" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: "#5A6B7B" }}>
                      No transactions match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTxn && (
        <TransactionDetail txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}
    </DashboardShell>
  );
}
