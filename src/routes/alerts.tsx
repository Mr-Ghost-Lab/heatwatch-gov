import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, Clock3, MapPin } from "lucide-react";
import { alertsApi } from "@/api/alertsApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { Button } from "@/components/ui/button";
import type { AlertCategory, HeatAlert } from "@/types";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Heat Alerts — ThermoShield" },
      {
        name: "description",
        content: "Current ward-level heat alerts, expected duration and recommended response actions.",
      },
      { property: "og:title", content: "Heat Alerts — ThermoShield" },
      { property: "og:description", content: "Current ward-level heat alerts and response guidance." },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/alerts">
      <AlertsModule />
    </AuthenticatedPage>
  ),
});

const CATEGORY_LABEL: Record<AlertCategory, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MODERATE: "Moderate",
  INFORMATIONAL: "Informational",
};

const CATEGORY_CLASS: Record<AlertCategory, string> = {
  CRITICAL: "border-risk-critical/40 bg-risk-critical-surface text-risk-critical",
  HIGH: "border-risk-high/40 bg-risk-high-surface text-risk-high",
  MODERATE: "border-risk-moderate/40 bg-risk-moderate-surface text-risk-moderate",
  INFORMATIONAL: "border-primary/30 bg-primary/5 text-primary",
};

function AlertsModule() {
  const query = useQuery({ queryKey: ["alerts"], queryFn: () => alertsApi.list() });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Heat Alerts"
        description="Issued heat-health warnings and the recommended action for each affected ward."
        meta={query.data ? `${query.data.filter((alert) => !alert.read).length} unread alert${query.data.filter((alert) => !alert.read).length === 1 ? "" : "s"}` : undefined}
        actions={
          <Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>
            {query.isFetching ? "Refreshing…" : "Refresh alerts"}
          </Button>
        }
      />
      <PrototypeNotice />

      <QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={4}>
        {query.data ? (
          <section aria-label="Heat alerts" className="space-y-3">
            {query.data.length > 0 ? query.data.map((alert) => <AlertRow key={alert.id} alert={alert} onUpdated={() => void query.refetch()} />) : (
              <div className="gov-panel p-8 text-center">
                <Check className="mx-auto size-6 text-risk-low" aria-hidden="true" />
                <p className="mt-2 font-semibold text-foreground">No active alerts</p>
                <p className="mt-1 text-sm text-muted-foreground">There are no heat alerts issued for your jurisdiction.</p>
              </div>
            )}
          </section>
        ) : null}
      </QueryBoundary>
    </div>
  );
}

function AlertRow({ alert, onUpdated }: { alert: HeatAlert; onUpdated: () => void }) {
  async function markRead() {
    if (!alert.read) {
      await alertsApi.markRead(alert.id);
      onUpdated();
    }
  }

  return (
    <article className={`gov-panel border-l-4 p-4 ${alert.read ? "border-l-border" : "border-l-primary"}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-risk-high" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{alert.title}</h2>
              <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_CLASS[alert.category]}`}>
                {CATEGORY_LABEL[alert.category]}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" aria-hidden="true" />{alert.location}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" />Expected {alert.expectedDuration}</span>
            </div>
          </div>
        </div>
        {!alert.read ? (
          <Button variant="outline" size="sm" onClick={() => void markRead()}>
            <Check className="size-4" aria-hidden="true" /> Mark as read
          </Button>
        ) : <span className="text-xs text-muted-foreground">Read</span>}
      </div>
      <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm md:grid-cols-3">
        <div><p className="gov-section-title">Reason</p><p className="mt-1 text-foreground">{alert.reason}</p></div>
        <div><p className="gov-section-title">Recommended action</p><p className="mt-1 font-medium text-foreground">{alert.recommendedAction}</p></div>
        <div><p className="gov-section-title">Responsible authority</p><p className="mt-1 text-foreground">{alert.responsibleAuthority}</p></div>
      </div>
    </article>
  );
}