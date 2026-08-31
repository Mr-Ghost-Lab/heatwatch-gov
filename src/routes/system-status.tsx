import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, Clock3, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { systemApi } from "@/api/systemApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/system-status")({
  head: () => ({ meta: [
    { title: "System Status — ThermoShield" },
    { name: "description", content: "Monitor ThermoShield data feeds, forecasting, GIS, alerts and backend service health." },
    { property: "og:title", content: "System Status — ThermoShield" },
    { property: "og:description", content: "ThermoShield platform service health and data freshness." },
  ] }),
  component: () => <AuthenticatedPage path="/system-status"><SystemStatusModule /></AuthenticatedPage>,
});

function SystemStatusModule() {
  const query = useQuery({ queryKey: ["system", "status"], queryFn: () => systemApi.getStatus() });
  return <div className="space-y-6"><PageHeader title="System Status" description="Service availability, response latency and data freshness for the intelligence platform." actions={<Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>Refresh status</Button>} /><PrototypeNotice /><QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={6}>{query.data ? <><section aria-label="Platform services" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{query.data.services.map((service) => { const operational = service.status === "OPERATIONAL"; return <article key={service.name} className="gov-panel p-4"><div className="flex items-start justify-between gap-3"><div className="flex gap-2"><Activity className="mt-0.5 size-4 text-primary" aria-hidden="true" /><h2 className="text-sm font-semibold text-foreground">{service.name}</h2></div>{operational ? <CheckCircle2 className="size-5 text-risk-low" aria-label="Operational" /> : <TriangleAlert className="size-5 text-risk-moderate" aria-label="Degraded" />}</div><p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{service.status}</p><p className="mt-1 text-sm text-foreground">{service.latencyMs === null ? "Latency unavailable" : `${service.latencyMs} ms response latency`}</p><p className="mt-2 text-xs text-muted-foreground">Checked {new Date(service.lastCheck).toLocaleTimeString("en-IN")}</p></article>; })}</section><section aria-label="Data freshness" className="gov-panel p-4"><p className="gov-section-title">Data freshness and model</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-muted-foreground">Last data update</dt><dd className="mt-1 flex items-center gap-1 font-semibold text-foreground"><Clock3 className="size-3.5" aria-hidden="true" />{new Date(query.data.lastDataUpdate).toLocaleString("en-IN")}</dd></div><div><dt className="text-muted-foreground">Last successful request</dt><dd className="mt-1 font-semibold text-foreground">{new Date(query.data.lastSuccessfulRequest).toLocaleString("en-IN")}</dd></div><div><dt className="text-muted-foreground">Model status</dt><dd className="mt-1 font-semibold text-foreground">{query.data.modelStatus}</dd></div><div><dt className="text-muted-foreground">Model version</dt><dd className="mt-1 gov-data text-foreground">{query.data.modelVersion}</dd></div></dl></section></> : null}</QueryBoundary></div>;
}