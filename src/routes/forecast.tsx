import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { forecastApi } from "@/api/forecastApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { RiskBadge } from "@/components/risk-badge";
import { StatCard } from "@/components/stat-card";
import { WardSelect, useWards } from "@/components/ward-select";
import { DataTable, type Column } from "@/components/data-table";
import type { ForecastDay } from "@/types";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Heat Forecast — ThermoShield" },
      {
        name: "description",
        content:
          "Three to five day ward-level heat forecast with temperature, WBGT, UTCI, heat index and projected health risk classes.",
      },
      { property: "og:title", content: "Heat Forecast — ThermoShield" },
      {
        property: "og:description",
        content: "Ward-level 5-day heat forecast with thermal stress and health risk projections.",
      },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/forecast">
      <ForecastModule />
    </AuthenticatedPage>
  ),
});

function ForecastModule() {
  const wardsQuery = useWards();
  const [wardId, setWardId] = useState("");
  const activeWardId = wardId || wardsQuery.data?.[0]?.id || "";

  const forecastQuery = useQuery({
    queryKey: ["forecast", activeWardId],
    queryFn: () => forecastApi.getWardForecast(activeWardId),
    enabled: Boolean(activeWardId),
  });

  const days = forecastQuery.data ?? [];
  const peak = days.reduce<ForecastDay | null>(
    (acc, d) => (!acc || d.temperatureC > acc.temperatureC ? d : acc),
    null,
  );
  const ward = wardsQuery.data?.find((w) => w.id === activeWardId);

  const columns: Column<ForecastDay>[] = [
    { key: "label", header: "Day", cell: (d) => <span className="font-medium text-foreground">{d.label}</span> },
    { key: "date", header: "Date", cell: (d) => <span className="gov-data">{d.date}</span> },
    {
      key: "temp",
      header: "Max / Min (°C)",
      sortValue: (d) => d.temperatureC,
      cell: (d) => (
        <span className="gov-data">
          {d.temperatureC} / {d.minTemperatureC}
        </span>
      ),
    },
    { key: "humidity", header: "Humidity (%)", sortValue: (d) => d.humidityPct, cell: (d) => <span className="gov-data">{d.humidityPct}</span> },
    { key: "wbgt", header: "WBGT (°C)", sortValue: (d) => d.wbgt, cell: (d) => <span className="gov-data">{d.wbgt}</span> },
    { key: "utci", header: "UTCI (°C)", sortValue: (d) => d.utci, cell: (d) => <span className="gov-data">{d.utci}</span> },
    { key: "hi", header: "Heat index (°C)", sortValue: (d) => d.heatIndex, cell: (d) => <span className="gov-data">{d.heatIndex}</span> },
    { key: "risk", header: "Heat risk", cell: (d) => <RiskBadge level={d.riskLevel} /> },
    { key: "health", header: "Health risk", cell: (d) => <RiskBadge level={d.healthRisk} /> },
    { key: "conf", header: "Confidence", sortValue: (d) => d.confidencePct, cell: (d) => <span className="gov-data">{d.confidencePct}%</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Heat Forecast"
        description="Forecast horizon of five days for the selected ward, combining meteorological inputs with thermal stress and health-risk projections."
        meta={ward ? `${ward.name} · ${ward.zone} · ${ward.city}` : undefined}
        actions={
          wardsQuery.data ? (
            <WardSelect wards={wardsQuery.data} value={activeWardId} onChange={setWardId} />
          ) : undefined
        }
      />
      <PrototypeNotice />

      <QueryBoundary
        isPending={wardsQuery.isPending || forecastQuery.isPending}
        error={wardsQuery.error ?? forecastQuery.error}
        refetch={() => void forecastQuery.refetch()}
        rows={7}
      >
        <section aria-label="Forecast highlights" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Peak temperature in horizon"
            value={peak ? peak.temperatureC : "—"}
            unit="°C"
            hint={peak ? `Expected on ${peak.label} (${peak.date})` : undefined}
            tone="critical"
            footer={peak ? <RiskBadge level={peak.riskLevel} /> : undefined}
          />
          <StatCard
            label="Peak WBGT"
            value={days.length ? Math.max(...days.map((d) => d.wbgt)) : "—"}
            unit="°C"
            hint="Wet Bulb Globe Temperature — occupational exposure threshold indicator"
            tone="high"
          />
          <StatCard
            label="Peak UTCI"
            value={days.length ? Math.max(...days.map((d) => d.utci)) : "—"}
            unit="°C"
            hint="Universal Thermal Climate Index — perceived physiological stress"
            tone="high"
          />
          <StatCard
            label="Mean model confidence"
            value={days.length ? Math.round(days.reduce((a, d) => a + d.confidencePct, 0) / days.length) : "—"}
            unit="%"
            hint="Ensemble agreement across the forecast horizon"
            tone="primary"
          />
        </section>

        <section aria-label="Forecast trend" className="gov-panel p-4">
          <p className="gov-section-title">Temperature and thermal stress trend</p>
          <div className="mt-4 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={days} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit="°" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 2,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="temperatureC" name="Max temperature" stroke="#b91c1c" strokeWidth={2} dot />
                <Line type="monotone" dataKey="wbgt" name="WBGT" stroke="#1d4ed8" strokeWidth={2} dot />
                <Line type="monotone" dataKey="utci" name="UTCI" stroke="#0f766e" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Red — maximum air temperature. Blue — Wet Bulb Globe Temperature. Teal — Universal Thermal
            Climate Index.
          </p>
        </section>

        <section aria-label="Forecast table">
          <p className="gov-section-title mb-2">Daily forecast detail</p>
          <DataTable
            rows={days}
            columns={columns}
            pageSize={7}
            caption="Daily heat forecast for the selected ward"
          />
        </section>
      </QueryBoundary>
    </div>
  );
}
