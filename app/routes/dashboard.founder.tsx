import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { DashboardShell } from "~/components/dashboard-shell";
import { Card, CardContent } from "~/components/ui/card";
import { ExternalLink, Github, Twitter } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

const FOUNDER = {
  name: "KOSASIH",
  title: "Founder & CEO",
  country: "Indonesia",
  countryFlag: "🇮🇩",
  photoUrl:
    "https://client-api.quantumbyte.ai/uploads/eqn1zqlg/4751/assets/a7c49b53-97d6-49d2-afe5-7366df151de2_1781613999750_typywf.jpg",
  bio: "KOSASIH is the Founder & CEO of AZHAR — the world's first Shariah-compliant sovereign financial management platform. Built on Islamic principles of transparency, justice, and zero-Riba finance, AZHAR is his vision for Financial System 7.0 across OIC nations.",
  social: {
    linkedin: "https://www.linkedin.com/in/kosasih-81b46b5a?trk=contact-info",
    twitter: "https://x.com/Kosasihg88G",
    github: "https://github.com/KOSASIH",
  },
};

export default function FounderPage() {
  return (
    <DashboardShell>
      <div className="p-6">
        {/* Page header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{
              color: "#1A1A2E",
              fontFamily: "Playfair Display, Georgia, serif",
            }}
          >
            Founder &amp; CEO
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5A6B7B" }}>
            The visionary behind AZHAR Shariah Finance Platform
          </p>
        </div>

        {/* Profile card */}
        <Card className="overflow-hidden border-0 shadow-lg max-w-3xl">
          {/* Emerald header band */}
          <div
            className="h-24 w-full"
            style={{
              background:
                "linear-gradient(135deg, #0F3D2A 0%, #1A6B4A 60%, #0F3D2A 100%)",
            }}
          />

          <CardContent className="pt-0 px-8 pb-8">
            {/* Photo + identity row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
              {/* Circular photo */}
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4 flex-shrink-0 shadow-xl"
                style={{ borderColor: "#C9A84C" }}
              >
                <img
                  src={FOUNDER.photoUrl}
                  alt={FOUNDER.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name + title */}
              <div className="pb-1 sm:pb-2">
                <h2
                  className="text-3xl font-black tracking-wide leading-tight"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "Playfair Display, Georgia, serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {FOUNDER.name}
                </h2>
                <p
                  className="text-base font-semibold mt-0.5"
                  style={{ color: "#1A6B4A" }}
                >
                  {FOUNDER.title}
                </p>
                {/* Country badge */}
                <span
                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "#F0F9F4",
                    color: "#0F3D2A",
                    border: "1px solid #B7DFC9",
                  }}
                >
                  <span className="text-base leading-none">
                    {FOUNDER.countryFlag}
                  </span>
                  {FOUNDER.country}
                </span>
              </div>
            </div>

            {/* Gold divider */}
            <div
              className="h-px w-full mb-6"
              style={{ background: "#C9A84C", opacity: 0.35 }}
            />

            {/* Bio */}
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "#374151" }}
            >
              {FOUNDER.bio}
            </p>

            {/* Social links */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#5A6B7B" }}
              >
                Connect
              </p>
              <div className="flex flex-wrap gap-3">
                {/* LinkedIn */}
                <a
                  href={FOUNDER.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#1D4ED8", color: "#FFFFFF" }}
                >
                  <ExternalLink size={14} />
                  LinkedIn
                </a>

                {/* Twitter / X */}
                <a
                  href={FOUNDER.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#000000", color: "#FFFFFF" }}
                >
                  <Twitter size={14} />
                  Twitter / X
                </a>

                {/* GitHub */}
                <a
                  href={FOUNDER.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#1E293B", color: "#FFFFFF" }}
                >
                  <Github size={14} />
                  GitHub
                </a>
              </div>
            </div>

            {/* Gold accent footer */}
            <div
              className="mt-8 pt-6 border-t flex items-center gap-3"
              style={{ borderColor: "#E8E4DC" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ background: "#C9A84C" }}
              >
                A
              </div>
              <p className="text-xs" style={{ color: "#5A6B7B" }}>
                AZHAR — Financial System 7.0 &middot; Shariah-Compliant
                Sovereign Finance &middot; OIC Nations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
