import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { healthRiskApi } from "@/api/healthRiskApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { RiskBadge } from "@/components/risk-badge";
import { StatCard } from "@/components/stat-card";
import { WardSelect, useWards } from "@/components/ward-select";

export const Route = createFileRoute("/health-risk")({
  head: () => ({
    meta: [
      { title: "Health Impact Projection — ThermoShield" },
      {
        name: "description",
        content:
          "Projected heat-related hospitalisation and mortality risk per ward, with baseline versus projected daily admissions.",
      },
      { property: "og:title", content: "Health Impact Projection — ThermoShield" },
      {
        property: "og:description",
        content: "Projected heat-related hospitalisation and mortality risk per ward.",
      },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/health-risk">
      <HealthRiskModule />
    </AuthenticatedPage>
  ),
});

function HealthRiskModule() {
  const wardsQuery = useWards();
  const [wardId, setWardId] = useState("");
  const activeWardId = wardId || wardsQuery.data?.[0]?.id || "";

  const query = useQuery({
    queryKey: ["health-risk", activeWardId],
    queryFn: () => healthRiskApi.get(activeWardId),
    enabled: Boolean(activeWardId),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Impact Projection"
        description="Expected burden on health infrastructure derived from the thermal stress forecast and the vulnerability profile of the ward population."
        meta={query.data ? `${query.data.wardName} · Horizon: ${query.data.impact.forecastHorizon}` : undefined}
        actions={
          wardsQuery.data ? (
            <WardSelect wards={wardsQuery.data} value={activeWardId} onChange={setWardId} />
          ) : undefined
        }
      />
      <PrototypeNotice />

      <QueryBoundary
        isPending={wardsQuery.isPending || query.isPending}
        error={wardsQuery.error ?? query.error}
        refetch={() => void query.refetch()}
        rows={6}
      >
        {query.data ? (
          <>
            <section aria-label="Health indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Increase in hospitalisation risk"
                value={`+${query.data.impact.hospitalisationRiskPct}`}
                unit="%"
                hint="Relative to the seasonal baseline for this ward"
                tone="critical"
              />
              <StatCard
                label="Mortality risk class"
                value={query.data.impact.mortalityRisk}
                hint="Heat-attributable excess mortality classification"
                tone="high"
                footer={<RiskBadge level={query.data.impact.mortalityRisk} />}
              />
              <StatCard
                label="Baseline admissions per day"
                value={query.data.baselineAdmissionsPerDay}
                hint="Heat-related presentations under normal conditions"
                tone="neutral"
              />
              <StatCard
                label="Projected admissions per day"
                value={query.data.projectedAdmissionsPerDay}
                hint={`Model confidence ${query.data.impact.confidencePct}%`}
                tone="critical"
              />
            </section>

            <section aria-label="Hospitalisation risk trend" className="gov-panel p-4">
              <p className="gov-section-title">Projected hospitalisation risk across the forecast horizon</p>
              <div className="mt-4 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={query.data.trend} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 2,
                        border: "1px solid hsl(var(--border))",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="hospitalisationRiskPct"
                      name="Hospitalisation risk increase"
                      fill="#1d4ed8"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section aria-label="Daily health risk classification" className="gov-panel p-4">
              <p className="gov-section-title">Daily mortality risk classification</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {query.data.trend.map((day) => (
                  <li
                    key={day.label}
                    className="flex items-center justify-between gap-3 rounded-sm border border-border bg-muted/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{day.label}</p>
                      <p className="gov-data text-xs text-muted-foreground">
                        +{day.hospitalisationRiskPct}% hospitalisation risk
                      </p>
                    </div>
                    <RiskBadge level={day.mortalityRisk} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                Projections are advisory. Clinical resourcing decisions must be confirmed with the Public
                Health Department.
              </p>
            </section>
          </>
        ) : null}
      </QueryBoundary>
    </div>
  );
}
