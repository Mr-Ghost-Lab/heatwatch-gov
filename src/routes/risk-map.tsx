import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import "maplibre-gl/dist/maplibre-gl.css";
import { riskApi } from "@/api/riskApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { RiskBadge, RISK_LABEL } from "@/components/risk-badge";
import { RISK_HEX, RISK_ORDER } from "@/mocks/thermoshield";
import type { RiskLevel, Ward } from "@/types";

export const Route = createFileRoute("/risk-map")({
  head: () => ({
    meta: [
      { title: "Heat Risk Map — ThermoShield" },
      {
        name: "description",
        content:
          "Interactive ward-level GIS heat risk map with colour-graded risk classes, live conditions and thermal stress readings.",
      },
      { property: "og:title", content: "Heat Risk Map — ThermoShield" },
      { property: "og:description", content: "Interactive ward-level GIS heat risk map." },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/risk-map">
      <RiskMapModule />
    </AuthenticatedPage>
  ),
});

function RiskMapModule() {
  const mapQuery = useQuery({ queryKey: ["risk", "map"], queryFn: () => riskApi.getRiskMap() });
  const wardsQuery = useQuery({ queryKey: ["wards"], queryFn: () => riskApi.listWards() });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected: Ward | null = useMemo(
    () => wardsQuery.data?.find((w) => w.id === selectedId) ?? wardsQuery.data?.[0] ?? null,
    [wardsQuery.data, selectedId],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Heat Risk Map"
        description="Geospatial heat-risk classification for every ward in the jurisdiction. Select a ward polygon to inspect its conditions and drivers."
        meta={mapQuery.data ? `Layer updated ${new Date(mapQuery.data.updatedAt).toLocaleString("en-IN")}` : undefined}
      />
      <PrototypeNotice />

      <QueryBoundary
        isPending={mapQuery.isPending || wardsQuery.isPending}
        error={mapQuery.error ?? wardsQuery.error}
        refetch={() => {
          void mapQuery.refetch();
          void wardsQuery.refetch();
        }}
        rows={8}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="gov-panel overflow-hidden">
            {mapQuery.data ? (
              <MapCanvas geojson={mapQuery.data.geojson} onSelect={setSelectedId} />
            ) : null}
            <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3">
              <span className="gov-section-title">Risk classification</span>
              {[...RISK_ORDER].reverse().map((level) => (
                <span key={level} className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <span
                    className="size-3 rounded-sm border border-border"
                    style={{ backgroundColor: RISK_HEX[level] }}
                    aria-hidden="true"
                  />
                  {RISK_LABEL[level as RiskLevel]}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            {selected ? (
              <div className="gov-panel p-4">
                <p className="gov-section-title">Selected ward</p>
                <h2 className="mt-1 text-base font-semibold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.zone} · {selected.city}
                </p>
                <div className="mt-3">
                  <RiskBadge level={selected.riskLevel} />
                </div>
                <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                  {[
                    ["Risk index", `${selected.riskIndex} / 100`],
                    ["Air temperature", `${selected.weather.temperatureC} °C`],
                    ["Relative humidity", `${selected.weather.humidityPct} %`],
                    ["Wind speed", `${selected.weather.windSpeedKmph} km/h`],
                    ["Solar radiation", selected.weather.solarRadiation],
                    ["WBGT", `${selected.thermalStress.wbgt} °C`],
                    ["UTCI", `${selected.thermalStress.utci} °C`],
                    ["Population", selected.population.totalPopulation.toLocaleString("en-IN")],
                    ["Vulnerable residents", selected.population.vulnerableTotal.toLocaleString("en-IN")],
                  ].map(([term, detail]) => (
                    <div key={term} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{term}</dt>
                      <dd className="gov-data text-right">{detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="gov-panel p-4">
              <p className="gov-section-title">Wards by risk</p>
              <ul className="mt-2 divide-y divide-border">
                {(wardsQuery.data ?? [])
                  .slice()
                  .sort((a, b) => b.riskIndex - a.riskIndex)
                  .map((ward) => (
                    <li key={ward.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(ward.id)}
                        aria-pressed={selected?.id === ward.id}
                        className={`flex w-full items-center justify-between gap-2 py-2 text-left text-sm transition-colors hover:text-primary ${
                          selected?.id === ward.id ? "font-semibold text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{ward.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="gov-data text-xs text-muted-foreground">{ward.riskIndex}</span>
                          <span
                            className="size-3 rounded-sm border border-border"
                            style={{ backgroundColor: RISK_HEX[ward.riskLevel] }}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </QueryBoundary>
    </div>
  );
}

function MapCanvas({
  geojson,
  onSelect,
}: {
  geojson: import("@/types").RiskMapResponse["geojson"];
  onSelect: (wardId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      try {
        const maplibre = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        const map = new maplibre.Map({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {},
            layers: [{ id: "background", type: "background", paint: { "background-color": "#eef1f5" } }],
          },
          center: [80.25, 13.05],
          zoom: 10.4,
          attributionControl: false,
        });
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          map.addSource("wards", { type: "geojson", data: geojson });
          map.addLayer({
            id: "wards-fill",
            type: "fill",
            source: "wards",
            paint: { "fill-color": ["get", "fillColor"], "fill-opacity": 0.78 },
          });
          map.addLayer({
            id: "wards-outline",
            type: "line",
            source: "wards",
            paint: { "line-color": "#1e293b", "line-width": 1 },
          });
          map.addLayer({
            id: "wards-label",
            type: "symbol",
            source: "wards",
            layout: { "text-field": ["get", "name"], "text-size": 11 },
            paint: { "text-color": "#0f172a", "text-halo-color": "#ffffff", "text-halo-width": 1.2 },
          });
        });

        map.on("click", "wards-fill", (event) => {
          const wardId = event.features?.[0]?.properties?.["wardId"];
          if (typeof wardId === "string") onSelect(wardId);
        });
        map.on("mouseenter", "wards-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "wards-fill", () => {
          map.getCanvas().style.cursor = "";
        });

        cleanup = () => map.remove();
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [geojson, onSelect]);

  if (failed) {
    return (
      <div className="p-6 text-sm text-muted-foreground" role="alert">
        The map renderer could not be initialised in this browser. Ward risk data remains available in the
        list alongside.
      </div>
    );
  }

  return <div ref={containerRef} className="h-[560px] w-full" role="application" aria-label="Ward heat risk map" />;
}
