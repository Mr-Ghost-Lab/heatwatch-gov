import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrototypeNotice } from "@/components/prototype-notice";
import { PROTOTYPE_ACCOUNT_LIST } from "@/api/authApi";
import { USE_MOCK_DATA } from "@/api/client";
import { ROLE_LABEL, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — ThermoShield Heatwave Intelligence" },
      {
        name: "description",
        content:
          "Authorised access for municipal, disaster management, health and field officers to the ThermoShield heatwave early-warning platform.",
      },
      { property: "og:title", content: "Sign in — ThermoShield Heatwave Intelligence" },
      {
        property: "og:description",
        content: "Authorised access to ward-level heat risk intelligence and early warning.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") void navigate({ to: "/dashboard" });
  }, [status, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-between bg-sidebar px-6 py-10 text-sidebar-foreground lg:px-12">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/60">
            Government of Tamil Nadu · Urban Local Body
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">ThermoShield</h1>
          <p className="mt-2 max-w-md text-sm text-sidebar-foreground/80">
            Human-centric heatwave intelligence and early-warning platform. Ward-level thermal stress,
            health impact projection and intervention tracking for administrative decision-making.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            {[
              ["Situation awareness", "Ward heat risk map, live conditions and 5-day forecast."],
              ["Human impact", "WBGT / UTCI thermal stress and hospitalisation risk projection."],
              ["Accountable response", "Recommended interventions with officers, deadlines and status."],
            ].map(([term, detail]) => (
              <div key={term} className="border-l-2 border-sidebar-foreground/25 pl-3">
                <dt className="font-semibold">{term}</dt>
                <dd className="text-sidebar-foreground/70">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-10 text-xs text-sidebar-foreground/55">
          Authorised use only. All access is logged and auditable.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <PrototypeNotice className="mb-6" />
          <h2 className="gov-page-title">Official sign-in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the credentials issued by your department administrator.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Official email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@thermoshield.gov"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? (
              <p className="gov-panel border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Verifying credentials…" : "Sign in"}
            </Button>
          </form>

          {USE_MOCK_DATA ? (
            <div className="gov-panel mt-8 p-4">
              <p className="gov-section-title">Prototype accounts</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Password for every account: <span className="gov-data">thermoshield</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs">
                {PROTOTYPE_ACCOUNT_LIST.map((account) => (
                  <li key={account.email} className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      className="gov-data text-primary underline-offset-2 hover:underline"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword("thermoshield");
                      }}
                    >
                      {account.email}
                    </button>
                    <span className="text-muted-foreground">{ROLE_LABEL[account.role]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
