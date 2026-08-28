import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { populationApi } from "@/api/populationApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { StatCard } from "@/components/stat-card";
import { WardSelect, useWards } from "@/components/ward-select";

export const Route = createFileRoute("/population")({
  head: () => ({
    meta: [
      { title: "Vulnerable Population — ThermoShield" },
      {
        name: "description",
        content:
          "Ward-level vulnerable population profile: elderly residents, children, outdoor workers and low-income households exposed to heat.",
      },
      { property: "og:title", content: "Vulnerable Population — ThermoShield" },
      {
        property: "og:description",
        content: "Ward-level vulnerable population and exposure profile.",
      },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/population">
      <PopulationModule />
    </AuthenticatedPage>
  ),
});

function PopulationModule() {
  const wardsQuery = useWards();
  const [wardId, setWardId] = useState("");
  const activeWardId = wardId || wardsQuery.data?.[0]?.id || "";

  const query = useQuery({
    queryKey: ["population", activeWardId],
    queryFn: () => populationApi.get(activeWardId),
    enabled: Boolean(activeWardId),
  });

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vulnerable Population Profile"
        description="Human exposure baseline for the ward. Heat risk is assessed against who is exposed, not the temperature alone."
        meta={query.data ? `${query.data.wardName} · ${fmt(query.data.profile.totalPopulation)} residents` : undefined}
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
            <section aria-label="Population indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total population"
                value={fmt(query.data.profile.totalPopulation)}
                hint="Registered residents in the ward"
                tone="neutral"
              />
              <StatCard
                label="Population density"
                value={fmt(query.data.profile.populationDensity)}
                unit="/ km²"
                hint="Built-form density strongly influences night-time heat retention"
                tone="primary"
              />
              <StatCard
                label="Vulnerable residents"
                value={fmt(query.data.profile.vulnerableTotal)}
                hint="Aggregate of high-sensitivity cohorts"
                tone="critical"
              />
              <StatCard
                label="Share vulnerable"
                value={Math.round(
                  (query.data.profile.vulnerableTotal / query.data.profile.totalPopulation) * 100,
                )}
                unit="%"
                hint="Proportion of the ward requiring priority protection"
                tone="high"
              />
            </section>

            <section aria-label="Vulnerable cohorts" className="gov-panel p-4">
              <p className="gov-section-title">Vulnerable cohort composition</p>
              <ul className="mt-3 space-y-4">
                {query.data.cohorts.map((cohort) => (
                  <li key={cohort.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{cohort.label}</span>
                      <span className="gov-data text-muted-foreground">
                        {fmt(cohort.value)} · {cohort.sharePct}%
                      </span>
                    </div>
                    <div className="mt-1 h-2.5 w-full rounded-sm bg-muted" role="presentation">
                      <div
                        className="h-2.5 rounded-sm bg-primary"
                        style={{ width: `${Math.min(100, cohort.sharePct)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="Protection guidance" className="gov-panel p-4">
              <p className="gov-section-title">Priority protection guidance</p>
              <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <li className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Elderly residents</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Door-to-door welfare checks by community health workers; ensure uninterrupted access to
                    drinking water and cooled indoor space.
                  </p>
                </li>
                <li className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Children</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Revise school and anganwadi timings; suspend outdoor assembly and sport during
                    peak-heat hours.
                  </p>
                </li>
                <li className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Outdoor workers</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Enforce work–rest cycles based on WBGT, shift labour to early morning, and provide shaded
                    rest points with oral rehydration salts.
                  </p>
                </li>
                <li className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Low-income households</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Extend water tanker coverage and public cooling-centre hours; prioritise settlements with
                    metal-sheet roofing.
                  </p>
                </li>
              </ul>
            </section>
          </>
        ) : null}
      </QueryBoundary>
    </div>
  );
}
