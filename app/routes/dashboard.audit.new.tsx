import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { Link } from "react-router";
import { ArrowLeft, ClipboardList, ExternalLink } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function NewAuditPage() {
  return (
    <DashboardShell>
      <div className="p-6 max-w-2xl">
        <Link
          to="/dashboard/audit"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "#5A6B7B" }}
        >
          <ArrowLeft size={16} />
          Back to Audit Dashboard
        </Link>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Create Shariah Audit Workflow
        </h1>
        <p className="text-sm mb-8" style={{ color: "#5A6B7B" }}>
          Configure an AI-assisted Shariah compliance audit using the AZHAR Judgment Engine.
          Define rules, criteria, and evidence fields for your institution.
        </p>

        <div className="space-y-4">
          <div className="azhar-card p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#D5F4E6" }}
              >
                <ClipboardList size={22} style={{ color: "#1A6B4A" }} />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-base mb-1" style={{ color: "#1A1A2E" }}>
                  Judgment Engine API
                </h2>
                <p className="text-sm mb-4" style={{ color: "#5A6B7B" }}>
                  Use the REST API to create a compliance workflow configuration. Define Shariah rules,
                  input evidence fields, and pass/fail criteria.
                </p>
                <div
                  className="rounded-lg p-4 font-mono text-xs overflow-x-auto"
                  style={{ background: "#0F3D2A", color: "#C9A84C" }}
                >
                  <p className="text-white/50 mb-2"># Create a Shariah audit config</p>
                  <p>POST /api/judgment/configs/direct</p>
                  <p className="text-white/50 mt-2 mb-1">Content-Type: application/json</p>
                  <p>{`{`}</p>
                  <p className="pl-4">{`"pluginId": "shariah_transaction_audit",`}</p>
                  <p className="pl-4">{`"name": "Shariah Transaction Audit",`}</p>
                  <p className="pl-4">{`"rules": "Evaluate the submitted transaction..."`}</p>
                  <p>{`}`}</p>
                </div>
                <a
                  href="/api/judgment/configs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium"
                  style={{ color: "#1A6B4A" }}
                >
                  View existing configs <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="azhar-card p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FDEBD0" }}
              >
                <ClipboardList size={22} style={{ color: "#E67E22" }} />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-base mb-1" style={{ color: "#1A1A2E" }}>
                  Parse from SOP Document
                </h2>
                <p className="text-sm mb-4" style={{ color: "#5A6B7B" }}>
                  Upload a Shariah compliance SOP or fatwa document and the AGI will auto-generate
                  an audit configuration from its content.
                </p>
                <div
                  className="rounded-lg p-4 font-mono text-xs overflow-x-auto"
                  style={{ background: "#0F3D2A", color: "#C9A84C" }}
                >
                  <p className="text-white/50 mb-2"># Parse SOP document into audit config</p>
                  <p>POST /api/judgment/configs/parse</p>
                  <p className="text-white/50 mt-2 mb-1">Content-Type: multipart/form-data</p>
                  <p>file=@shariah-sop.pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
