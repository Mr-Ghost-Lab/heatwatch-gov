import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboardApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { RiskBadge, RISK_LABEL } from "@/components/risk-badge";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import type { RiskLevel } from "@/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ThermoShield" },
      {
        name: "description",
        content:
          "Jurisdiction-wide heatwave situation summary: ward risk distribution, exposed population, active alerts and pending interventions.",
      },
      { property: "og:title", content: "Dashboard — ThermoShield" },
      { property: "og:description", content: "Jurisdiction-wide heatwave situation summary." },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/dashboard">
      <DashboardModule />
    </AuthenticatedPage>
  ),
});

const RISK_TONE: Record<RiskLevel, "low" | "moderate" | "high" | "critical"> = {
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
  CRITICAL: "critical",
};

function DashboardModule() {
  const query = useQuery({ queryKey: ["dashboard", "summary"], queryFn: () => dashboardApi.getSummary() });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Situation Dashboard"
        description="Consolidated heat-risk picture for the jurisdiction, refreshed from the forecasting and health-impact services."
        meta={query.data ? `Jurisdiction: ${query.data.jurisdiction} · Updated ${new Date(query.data.updatedAt).toLocaleString("en-IN")}` : undefined}
        actions={
          <Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>
            {query.isFetching ? "Refreshing…" : "Refresh data"}
          </Button>
        }
      />
      <PrototypeNotice />

      <QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={6}>
        {query.data ? (
          <>
            <section aria-label="Key indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Highest ward risk"
                value={query.data.criticalWard.riskIndex}
                unit="/ 100"
                hint={`${query.data.criticalWard.name} — ${query.data.criticalWard.zone}`}
                tone={RISK_TONE[query.data.criticalWard.riskLevel]}
                footer={<RiskBadge level={query.data.criticalWard.riskLevel} />}
              />
              <StatCard
                label="Population exposed (High + Critical)"
                value={query.data.populationExposed.toLocaleString("en-IN")}
                hint="Residents in wards at High or Critical heat risk"
                tone="primary"
              />
              <StatCard
                label="Active alerts"
                value={query.data.activeAlerts}
                hint="Issued and currently in force"
                tone="high"
                footer={
                  <Link to="/alerts" className="text-xs font-semibold text-primary hover:underline">
                    Review alerts
                  </Link>
                }
              />
              <StatCard
                label="Pending interventions"
                value={query.data.pendingActions}
                hint="Awaiting acknowledgement by responsible officers"
                tone="moderate"
              />
            </section>

            <section aria-label="Risk distribution" className="grid gap-4 lg:grid-cols-3">
              <div className="gov-panel p-4 lg:col-span-2">
                <p className="gov-section-title">Ward risk distribution</p>
                <ul className="mt-3 space-y-3">
                  {(["CRITICAL", "HIGH", "MODERATE", "LOW"] as RiskLevel[]).map((level) => {
                    const count = query.data!.counts[level];
                    const total = Object.values(query.data!.counts).reduce((a, b) => a + b, 0);
                    const pct = total ? Math.round((count / total) * 100) : 0;
                    return (
                      <li key={level}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{RISK_LABEL[level]} risk</span>
                          <span className="gov-data text-muted-foreground">
                            {count} ward{count === 1 ? "" : "s"} · {pct}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-sm bg-muted" role="presentation">
                          <div
                            className={`h-2 rounded-sm bg-risk-${level.toLowerCase()}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/risk-map"
                  className="mt-4 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  Open the ward heat-risk map
                </Link>
              </div>

              <div className="gov-panel p-4">
                <p className="gov-section-title">Forecast peak</p>
                <p className="mt-2 gov-data text-2xl text-risk-critical">
                  {query.data.forecastPeak.temperatureC}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">°C</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expected on {query.data.forecastPeak.day}
                </p>
                <div className="mt-3">
                  <RiskBadge level={query.data.forecastPeak.riskLevel} />
                </div>
                <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">WBGT</dt>
                    <dd className="gov-data">{query.data.criticalWard.thermalStress.wbgt} °C</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">UTCI</dt>
                    <dd className="gov-data">{query.data.criticalWard.thermalStress.utci} °C</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Hospitalisation risk</dt>
                    <dd className="gov-data">+{query.data.criticalWard.health.hospitalisationRiskPct}%</dd>
                  </div>
                </dl>
                <Link
                  to="/forecast"
                  className="mt-4 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  View the 5-day forecast
                </Link>
              </div>
            </section>

            <section aria-label="Priority ward" className="gov-panel p-4">
              <p className="gov-section-title">Priority ward requiring intervention</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  {query.data.criticalWard.name} — {query.data.criticalWard.zone}
                </h2>
                <RiskBadge level={query.data.criticalWard.riskLevel} />
              </div>
              <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {query.data.criticalWard.drivers.map((driver) => (
                  <li key={driver.factor} className="rounded-sm border border-border bg-muted/40 p-3">
                    <p className="font-semibold text-foreground">
                      {driver.factor}{" "}
                      <span className="gov-data text-xs text-muted-foreground">
                        ({driver.contributionPct}%)
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{driver.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </QueryBoundary>
    </div>
  );
}
