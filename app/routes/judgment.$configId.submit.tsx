import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { ArrowLeft, Send, CheckCircle, AlertTriangle, XCircle, Loader } from "lucide-react";
import { useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");

  const configId = params.configId;
  const baseUrl = new URL(request.url).origin;

  let config: any = null;
  try {
    const res = await fetch(`${baseUrl}/api/judgment/configs/${configId}`);
    if (res.ok) {
      const data = await res.json();
      config = data.config ?? data;
    }
  } catch {
    // ignore
  }

  return { user, config, configId };
}

function VerdictPanel({ result }: { result: any }) {
  if (!result) return null;

  const verdictMap: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pass: { label: "Compliant (Pass)", color: "#27AE60", bg: "#D5F4E6", icon: CheckCircle },
    partial: { label: "Conditionally Compliant", color: "#E67E22", bg: "#FDEBD0", icon: AlertTriangle },
    fail: { label: "Non-Compliant (Fail)", color: "#C0392B", bg: "#FADBD8", icon: XCircle },
    risk: { label: "Risk Detected", color: "#C0392B", bg: "#FADBD8", icon: AlertTriangle },
    ready: { label: "Ready for Approval", color: "#27AE60", bg: "#D5F4E6", icon: CheckCircle },
    not_ready: { label: "Not Ready", color: "#E67E22", bg: "#FDEBD0", icon: AlertTriangle },
  };

  const vInfo = verdictMap[result.verdict] ?? { label: result.verdict, color: "#5A6B7B", bg: "#F8F6F1", icon: CheckCircle };
  const VIcon = vInfo.icon;

  return (
    <div
      className="rounded-xl border p-6 space-y-4"
      style={{ background: vInfo.bg, borderColor: vInfo.color }}
    >
      <div className="flex items-center gap-3">
        <VIcon size={24} color={vInfo.color} />
        <div>
          <p className="font-bold text-lg" style={{ color: vInfo.color, fontFamily: "Playfair Display, Georgia, serif" }}>
            {vInfo.label}
          </p>
          <p className="text-sm" style={{ color: "#5A6B7B" }}>
            Confidence: {(result.confidence * 100).toFixed(0)}% · Score: {result.score}/100 · Severity: {result.severity}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
          Assessment
        </p>
        <p className="text-sm" style={{ color: "#1A1A2E" }}>{result.reason}</p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
          Recommendation
        </p>
        <p className="text-sm" style={{ color: "#1A1A2E" }}>{result.fixSuggestion}</p>
      </div>
      {result.requiresHumanReview && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg border text-sm"
          style={{ background: "#FDEBD0", borderColor: "#E67E22", color: "#B8600E" }}
        >
          <AlertTriangle size={16} />
          This submission requires human review by a qualified Shariah board member.
        </div>
      )}
      {result.resultData?.shariahVerdict && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5A6B7B" }}>
            Shariah Verdict
          </p>
          <p className="text-sm font-bold" style={{ color: vInfo.color }}>
            {result.resultData.shariahVerdict}
          </p>
        </div>
      )}
    </div>
  );
}

export default function JudgmentSubmitPage() {
  const { config, configId } = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <DashboardShell>
        <div className="p-6">
          <Link to="/dashboard/audit" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "#5A6B7B" }}>
            <ArrowLeft size={16} />
            Back to Audit Dashboard
          </Link>
          <div className="azhar-card p-8 text-center">
            <p className="text-sm" style={{ color: "#5A6B7B" }}>
              Audit workflow not found: <code className="font-mono">{configId}</code>
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const properties = config.inputSchema?.properties ?? {};
  const required: string[] = config.inputSchema?.required ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("inputData", JSON.stringify(formData));

      const res = await fetch(`/api/judgment/configs/${configId}/submit`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submission failed");
      setResult(data.result ?? data);
    } catch (err: any) {
      setError(err.message ?? "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="p-6 max-w-3xl">
        <Link
          to="/dashboard/audit"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "#5A6B7B" }}
        >
          <ArrowLeft size={16} />
          Back to Audit Dashboard
        </Link>

        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "#1A1A2E", fontFamily: "Playfair Display, Georgia, serif" }}
        >
          {config.name}
        </h1>
        <p className="text-sm mb-6" style={{ color: "#5A6B7B" }}>
          Submit evidence for AI-assisted Shariah compliance review.
        </p>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="azhar-card p-6 space-y-5">
              {Object.entries(properties).map(([key, schema]: [string, any]) => {
                const isRequired = required.includes(key);
                const isFile = schema["x-ui"]?.widget === "file";
                const isTextarea = schema.type === "string" && (
                  key.toLowerCase().includes("text") ||
                  key.toLowerCase().includes("notes") ||
                  key.toLowerCase().includes("description") ||
                  key.toLowerCase().includes("evidence")
                );

                if (isFile) return null; // Skip file fields for demo

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1A1A2E" }}>
                      {schema.title ?? key}
                      {isRequired && <span style={{ color: "#C0392B" }}> *</span>}
                    </label>
                    {schema.description && (
                      <p className="text-xs mb-2" style={{ color: "#5A6B7B" }}>
                        {schema.description}
                      </p>
                    )}
                    {isTextarea ? (
                      <textarea
                        rows={4}
                        required={isRequired}
                        className="w-full px-4 py-3 rounded-lg border text-sm bg-white resize-none outline-none"
                        style={{ borderColor: "#E8E4DC", color: "#1A1A2E" }}
                        value={formData[key] ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={schema.description ?? `Enter ${schema.title ?? key}`}
                      />
                    ) : schema.type === "number" ? (
                      <input
                        type="number"
                        step="any"
                        required={isRequired}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none"
                        style={{ borderColor: "#E8E4DC", color: "#1A1A2E" }}
                        value={formData[key] ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || undefined }))}
                        placeholder="0"
                      />
                    ) : (
                      <input
                        type="text"
                        required={isRequired}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none"
                        style={{ borderColor: "#E8E4DC", color: "#1A1A2E" }}
                        value={formData[key] ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={schema.description ?? `Enter ${schema.title ?? key}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {error && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl border text-sm"
                style={{ background: "#FADBD8", borderColor: "#C0392B", color: "#C0392B" }}
              >
                <XCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: submitting ? "#A0C4B4" : "#1A6B4A",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Evaluating Shariah Compliance...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit for Shariah Review
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <VerdictPanel result={result} />
            <button
              onClick={() => { setResult(null); setFormData({}); }}
              className="text-sm font-medium"
              style={{ color: "#1A6B4A" }}
            >
              Submit another review
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
