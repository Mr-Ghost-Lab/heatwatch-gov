import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { thermalStressApi } from "@/api/thermalStressApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { StatCard } from "@/components/stat-card";
import { WardSelect, useWards } from "@/components/ward-select";

export const Route = createFileRoute("/thermal-stress")({
  head: () => ({
    meta: [
      { title: "Thermal Stress Assessment — ThermoShield" },
      {
        name: "description",
        content:
          "Human thermal stress assessment per ward using WBGT, UTCI and heat index with the contributing physical drivers explained.",
      },
      { property: "og:title", content: "Thermal Stress Assessment — ThermoShield" },
      {
        property: "og:description",
        content: "WBGT, UTCI and heat index assessment with driver attribution per ward.",
      },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/thermal-stress">
      <ThermalStressModule />
    </AuthenticatedPage>
  ),
});

const TREND_LABEL: Record<string, string> = {
  RISING: "Rising",
  STABLE: "Stable",
  FALLING: "Falling",
};

function ThermalStressModule() {
  const wardsQuery = useWards();
  const [wardId, setWardId] = useState("");
  const activeWardId = wardId || wardsQuery.data?.[0]?.id || "";

  const query = useQuery({
    queryKey: ["thermal-stress", activeWardId],
    queryFn: () => thermalStressApi.get(activeWardId),
    enabled: Boolean(activeWardId),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thermal Stress Assessment"
        description="Physiological heat burden on the human body, expressed through standard occupational and biometeorological indices rather than air temperature alone."
        meta={query.data ? `${query.data.wardName} · Trend: ${TREND_LABEL[query.data.thermalStress.trend] ?? query.data.thermalStress.trend}` : undefined}
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
            <section aria-label="Thermal indices" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="WBGT"
                value={query.data.thermalStress.wbgt}
                unit="°C"
                hint="Wet Bulb Globe Temperature — occupational exposure limit reference"
                tone="critical"
              />
              <StatCard
                label="UTCI"
                value={query.data.thermalStress.utci}
                unit="°C"
                hint="Universal Thermal Climate Index — perceived physiological stress"
                tone="high"
              />
              <StatCard
                label="Heat index"
                value={query.data.thermalStress.heatIndex}
                unit="°C"
                hint="Apparent temperature combining air temperature and humidity"
                tone="high"
              />
              <StatCard
                label="Short-term trend"
                value={TREND_LABEL[query.data.thermalStress.trend] ?? query.data.thermalStress.trend}
                hint="Direction of thermal stress over the next 24 hours"
                tone="moderate"
              />
            </section>

            <section aria-label="Risk drivers" className="grid gap-4 lg:grid-cols-2">
              <div className="gov-panel p-4">
                <p className="gov-section-title">Contributing drivers</p>
                <ul className="mt-3 space-y-3">
                  {query.data.drivers.map((driver) => (
                    <li key={driver.factor}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{driver.factor}</span>
                        <span className="gov-data text-muted-foreground">{driver.contributionPct}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-sm bg-muted" role="presentation">
                        <div
                          className="h-2 rounded-sm bg-primary"
                          style={{ width: `${Math.min(100, driver.contributionPct)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{driver.note}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gov-panel p-4">
                <p className="gov-section-title">Why this ward is under stress</p>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {query.data.explanation.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  Indices are computed by the thermal-stress service. WBGT above 31 °C generally requires
                  suspension of heavy outdoor work; UTCI above 38 °C denotes very strong heat stress.
                </p>
              </div>
            </section>
          </>
        ) : null}
      </QueryBoundary>
    </div>
  );
}
