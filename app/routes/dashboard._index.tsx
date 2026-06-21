import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { useConfigurables } from "~/modules/configurables";
import {
  DASHBOARD_STATS,
  MOCK_TRANSACTIONS,
  AZHAR_RESERVES,
  MOCK_BRANCH_SCORES,
} from "~/lib/mock-data";
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Coins,
  Clock,
  CheckCircle,
  BarChart2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="azhar-card p-5 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
          {label}
        </p>
        <p className="text-2xl font-bold" style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function ComplianceBadge({ status }: { status: "Halal" | "Haram" | "Mashbooh" }) {
  const map = {
    Halal: "badge-halal",
    Haram: "badge-haram",
    Mashbooh: "badge-mashbooh",
  };
  return <span className={map[status]}>{status}</span>;
}

const RESERVE_COLORS = AZHAR_RESERVES.components.map((c) => c.color);

export default function DashboardOverview() {
  const { user } = useLoaderData<typeof loader>();
  const { config } = useConfigurables();
  const showStablecoin = config?.showAzharStablecoin ?? true;

  const recentTxns = MOCK_TRANSACTIONS.slice(0, 5);

  const pieData = [
    { name: "Halal", value: DASHBOARD_STATS.halalCount, color: "#27AE60" },
    { name: "Haram", value: DASHBOARD_STATS.haramCount, color: "#C0392B" },
    { name: "Mashbooh", value: DASHBOARD_STATS.mashboohCount, color: "#E67E22" },
  ];

  const branchChartData = MOCK_BRANCH_SCORES.map((b) => ({
    name: b.branch.replace(" Branch", "").replace(" Office", "").replace(" HQ", ""),
    score: b.score,
    flagged: b.flagged,
  }));

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Shariah Compliance Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
            Welcome back, {user?.username} — current period: Dhu al-Hijja 1447 / June 2026
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Screened"
            value={DASHBOARD_STATS.totalTransactionsScreened.toLocaleString()}
            sub="This compliance period"
            icon={BarChart2}
            iconBg="#D5F4E6"
            iconColor="#1A6B4A"
          />
          <StatCard
            label="Compliance Score"
            value={`${DASHBOARD_STATS.complianceScore}%`}
            sub="Across all branches"
            icon={ShieldCheck}
            iconBg="#D5F4E6"
            iconColor="#27AE60"
          />
          <StatCard
            label="Haram Flagged"
            value={DASHBOARD_STATS.haramCount}
            sub={`${DASHBOARD_STATS.mashboohCount} Mashbooh pending`}
            icon={AlertTriangle}
            iconBg="#FADBD8"
            iconColor="#C0392B"
          />
          <StatCard
            label="Zakat Due"
            value={`$${DASHBOARD_STATS.zakatDue.toLocaleString()}`}
            sub="For this Hawl year"
            icon={Coins}
            iconBg="#FDEBD0"
            iconColor="#E67E22"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Halal Transactions"
            value={DASHBOARD_STATS.halalCount.toLocaleString()}
            icon={CheckCircle}
            iconBg="#D5F4E6"
            iconColor="#27AE60"
          />
          <StatCard
            label="Mashbooh (Doubtful)"
            value={DASHBOARD_STATS.mashboohCount}
            sub="Awaiting board review"
            icon={HelpCircle}
            iconBg="#FDEBD0"
            iconColor="#E67E22"
          />
          <StatCard
            label="Pending Reviews"
            value={DASHBOARD_STATS.pendingReviews}
            sub="In escalation queue"
            icon={Clock}
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
          />
          <StatCard
            label="Active Alerts"
            value={DASHBOARD_STATS.activeAlerts}
            sub="Require attention"
            icon={TrendingUp}
            iconBg="#FADBD8"
            iconColor="#C0392B"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance breakdown pie chart */}
          <div className="azhar-card p-5">
            <h2 className="font-semibold text-base mb-4" style={{ color: "#1A1A2E" }}>
              Transaction Compliance Breakdown
            </h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [val, "Transactions"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: entry.color }}
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: "#1A1A2E" }}>
                        {entry.name}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#1A1A2E" }}>
                        {entry.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branch compliance bar chart */}
          <div className="azhar-card p-5">
            <h2 className="font-semibold text-base mb-4" style={{ color: "#1A1A2E" }}>
              Branch Compliance Scores
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={branchChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5A6B7B" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5A6B7B" }} />
                <Tooltip />
                <Bar dataKey="score" fill="#1A6B4A" radius={[4, 4, 0, 0]} name="Compliance Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="azhar-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E8E4DC" }}>
            <h2 className="font-semibold text-base" style={{ color: "#1A1A2E" }}>
              Recent Transaction Screenings
            </h2>
            <a
              href="/dashboard/transactions"
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "#1A6B4A" }}
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8F6F1" }}>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Description</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Branch</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "#5A6B7B" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#E8E4DC", background: idx % 2 === 0 ? "#FFFFFF" : "#FAFAF8" }}
                  >
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "#5A6B7B" }}>
                      {txn.id}
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-medium truncate" style={{ color: "#1A1A2E" }}>
                        {txn.description}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#5A6B7B" }}>
                        {txn.counterparty}
                      </p>
                    </td>
                    <td className="px-5 py-3 font-medium" style={{ color: "#1A1A2E" }}>
                      {txn.amount.toLocaleString()} {txn.currency}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "#5A6B7B" }}>
                      {txn.branch}
                    </td>
                    <td className="px-5 py-3">
                      <ComplianceBadge status={txn.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* THE AZHAR Stablecoin panel */}
        {showStablecoin && (
          <div className="azhar-card overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "#E8E4DC" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-base" style={{ color: "#1A1A2E" }}>
                    THE AZHAR Reserve Transparency Panel
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "#5A6B7B" }}>
                    THE MOST SUPER ADVANCED HYBRID Stablecoin · Asset-backed 1:1 · Shariah-Certified
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#5A6B7B" }}>Collateralisation Ratio</p>
                  <p className="text-lg font-bold" style={{ color: "#27AE60", fontFamily: "Playfair Display, Georgia, serif" }}>
                    {AZHAR_RESERVES.collateralizationRatio}%
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {AZHAR_RESERVES.components.map((comp) => (
                  <div key={comp.label} className="text-center">
                    <div
                      className="w-full h-2 rounded-full mb-3"
                      style={{ background: comp.color }}
                    />
                    <p className="text-xs font-medium mb-1" style={{ color: "#5A6B7B" }}>
                      {comp.label}
                    </p>
                    <p className="text-lg font-bold" style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}>
                      {comp.percentage}%
                    </p>
                    <p className="text-xs" style={{ color: "#5A6B7B" }}>
                      ${(comp.value / 1e9).toFixed(2)}B
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "#E8E4DC" }}>
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7B" }}>Total Reserves</p>
                  <p className="text-xl font-bold" style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}>
                    ${(AZHAR_RESERVES.totalReserves / 1e9).toFixed(1)}B USD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#5A6B7B" }}>Last Shariah Audit</p>
                  <p className="text-sm font-medium" style={{ color: "#1A1A2E" }}>
                    {AZHAR_RESERVES.lastAudited}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
