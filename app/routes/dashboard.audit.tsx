import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import {
  MOCK_TRANSACTIONS,
  MOCK_BRANCH_SCORES,
  DASHBOARD_STATS,
  AZHAR_RESERVES,
} from "~/lib/mock-data";
import type { Transaction } from "~/lib/mock-data";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ClipboardList,
  Download,
  ExternalLink,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");

  // Fetch judgment configs for Shariah audit workflows
  const baseUrl = new URL(request.url).origin;
  let judgmentConfigs: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/judgment/configs`);
    if (res.ok) {
      const data = await res.json();
      judgmentConfigs = data.configs ?? data ?? [];
    }
  } catch {
    // API not yet ready — show empty state
  }

  return {
    user,
    judgmentConfigs,
    transactions: MOCK_TRANSACTIONS,
  };
}

function ComplianceBadge({ status }: { status: "Halal" | "Haram" | "Mashbooh" }) {
  const map = {
    Halal: "badge-halal",
    Haram: "badge-haram",
    Mashbooh: "badge-mashbooh",
  };
  return <span className={map[status]}>{status}</span>;
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 90 ? "#27AE60" : score >= 75 ? "#E67E22" : "#C0392B";
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 border-2"
      style={{ color, borderColor: color, background: "transparent" }}
    >
      {score}
    </div>
  );
}

const BRANCH_CHART_DATA = MOCK_BRANCH_SCORES.map((b) => ({
  name: b.branch.replace(" Branch", "").replace(" Office", "").replace(" HQ", ""),
  score: b.score,
  flagged: b.flagged,
  total: b.total,
}));

const MONTHLY_DATA = [
  { month: "Jan", halal: 180, haram: 22, mashbooh: 14 },
  { month: "Feb", halal: 195, haram: 18, mashbooh: 11 },
  { month: "Mar", halal: 210, haram: 30, mashbooh: 16 },
  { month: "Apr", halal: 225, haram: 25, mashbooh: 12 },
  { month: "May", halal: 240, haram: 28, mashbooh: 18 },
  { month: "Jun", halal: 260, haram: 35, mashbooh: 20 },
];

export default function AuditDashboardPage() {
  const { user, judgmentConfigs, transactions } = useLoaderData<typeof loader>();
  const [dateRange, setDateRange] = useState("30d");

  const flaggedTxns = transactions.filter((t) => t.status === "Haram" || t.status === "Mashbooh");
  const escalationQueue = transactions.filter((t) => t.status === "Mashbooh");

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Shariah Audit Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
              Operator view — flagged transactions, branch compliance scores, escalation queue, and audit workflows
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={{
                  background: dateRange === range ? "#1A6B4A" : "#FFFFFF",
                  color: dateRange === range ? "white" : "#5A6B7B",
                  borderColor: dateRange === range ? "#1A6B4A" : "#E8E4DC",
                }}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{ borderColor: "#E8E4DC", color: "#1A6B4A" }}
            >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Overall Compliance Score",
              value: `${DASHBOARD_STATS.complianceScore}%`,
              sub: "All branches combined",
              icon: ShieldCheck,
              iconBg: "#D5F4E6",
              iconColor: "#27AE60",
            },
            {
              label: "Flagged Transactions",
              value: DASHBOARD_STATS.haramCount + DASHBOARD_STATS.mashboohCount,
              sub: `${DASHBOARD_STATS.haramCount} Haram · ${DASHBOARD_STATS.mashboohCount} Mashbooh`,
              icon: AlertTriangle,
              iconBg: "#FADBD8",
              iconColor: "#C0392B",
            },
            {
              label: "Escalation Queue",
              value: DASHBOARD_STATS.pendingReviews,
              sub: "Awaiting Shariah board review",
              icon: Clock,
              iconBg: "#FDEBD0",
              iconColor: "#E67E22",
            },
            {
              label: "Audit Workflows",
              value: judgmentConfigs.length,
              sub: "Active judgment configs",
              icon: ClipboardList,
              iconBg: "#EEF2FF",
              iconColor: "#4F46E5",
            },
          ].map((stat) => (
            <div key={stat.label} className="azhar-card p-5 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: stat.iconBg }}
              >
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
                >
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
                    {stat.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly trend */}
          <div className="azhar-card p-5">
            <h2 className="font-semibold text-base mb-4" style={{ color: "#1A1A2E" }}>
              Monthly Compliance Trend
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5A6B7B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5A6B7B" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="halal" fill="#27AE60" name="Halal" radius={[2, 2, 0, 0]} />
                <Bar dataKey="haram" fill="#C0392B" name="Haram" radius={[2, 2, 0, 0]} />
                <Bar dataKey="mashbooh" fill="#E67E22" name="Mashbooh" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Branch scores */}
          <div className="azhar-card p-5">
            <h2 className="font-semibold text-base mb-4" style={{ color: "#1A1A2E" }}>
              Branch Compliance Scores
            </h2>
            <div className="space-y-3">
              {MOCK_BRANCH_SCORES.map((branch) => {
                const color =
                  branch.score >= 90 ? "#27AE60" : branch.score >= 75 ? "#E67E22" : "#C0392B";
                return (
                  <div key={branch.branch} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate" style={{ color: "#1A1A2E" }}>
                          {branch.branch}
                        </span>
                        <span className="text-xs font-bold ml-2" style={{ color }}>
                          {branch.score}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E8E4DC" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${branch.score}%`, background: color }}
                        />
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
                        {branch.flagged} flagged / {branch.total} total
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Escalation queue */}
        <div className="azhar-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E8E4DC" }}>
            <h2 className="font-semibold text-base" style={{ color: "#1A1A2E" }}>
              Escalation Queue — Pending Shariah Board Review
            </h2>
            <span className="badge-mashbooh">{escalationQueue.length} Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8F6F1" }}>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Description</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Branch</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {escalationQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: "#5A6B7B" }}>
                      No transactions pending Shariah board review.
                    </td>
                  </tr>
                ) : (
                  escalationQueue.map((txn, idx) => (
                    <tr
                      key={txn.id}
                      className="border-t"
                      style={{ borderColor: "#E8E4DC", background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAF8" }}
                    >
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: "#5A6B7B" }}>{txn.id}</td>
                      <td className="px-5 py-3 max-w-xs">
                        <p className="font-medium text-xs truncate" style={{ color: "#1A1A2E" }}>{txn.description}</p>
                        <p className="text-xs truncate" style={{ color: "#5A6B7B" }}>{txn.counterparty}</p>
                      </td>
                      <td className="px-5 py-3 text-xs font-medium" style={{ color: "#1A1A2E" }}>
                        {txn.amount.toLocaleString()} {txn.currency}
                      </td>
                      <td className="px-5 py-3 max-w-xs">
                        <p className="text-xs" style={{ color: "#5A6B7B" }}>{txn.reasonCode ?? "—"}</p>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: "#5A6B7B" }}>{txn.branch}</td>
                      <td className="px-5 py-3">
                        <ComplianceBadge status={txn.status as any} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Judgment Engine audit workflows */}
        <div className="azhar-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E8E4DC" }}>
            <div>
              <h2 className="font-semibold text-base" style={{ color: "#1A1A2E" }}>
                Shariah Audit Workflows (Judgment Engine)
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
                AI-assisted compliance workflows powered by the AZHAR Judgment Engine
              </p>
            </div>
            <Link
              to="/audit/new"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{ borderColor: "#1A6B4A", color: "#1A6B4A" }}
            >
              <ClipboardList size={14} />
              New Audit
            </Link>
          </div>
          <div className="p-5">
            {judgmentConfigs.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList size={32} className="mx-auto mb-3" style={{ color: "#E8E4DC" }} />
                <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>
                  No audit workflows configured yet
                </p>
                <p className="text-xs mt-1" style={{ color: "#5A6B7B" }}>
                  Create Shariah audit configurations via the Judgment Engine to enable AI-assisted compliance reviews.
                </p>
                <Link
                  to="/audit/new"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "#1A6B4A" }}
                >
                  <ClipboardList size={16} />
                  Create First Audit Workflow
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {judgmentConfigs.map((cfg: any) => (
                  <div
                    key={cfg.pluginId}
                    className="border rounded-xl p-4"
                    style={{ borderColor: "#E8E4DC" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm" style={{ color: "#1A1A2E" }}>
                          {cfg.name}
                        </p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: "#5A6B7B" }}>
                          {cfg.pluginId}
                        </p>
                      </div>
                      <Link
                        to={`/judgment/${cfg.pluginId}/submit`}
                        className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border flex-shrink-0"
                        style={{ borderColor: "#E8E4DC", color: "#1A6B4A" }}
                      >
                        Submit <ExternalLink size={10} />
                      </Link>
                    </div>
                    {cfg.variables?.dashboard?.title && (
                      <p className="text-xs mt-2" style={{ color: "#5A6B7B" }}>
                        {cfg.variables.dashboard.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
