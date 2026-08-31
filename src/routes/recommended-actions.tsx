import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { actionsApi } from "@/api/actionsApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ActionStatus, InterventionAction } from "@/types";

export const Route = createFileRoute("/recommended-actions")({
  head: () => ({
    meta: [
      { title: "Recommended Actions — ThermoShield" },
      { name: "description", content: "Coordinate heatwave interventions, owners and deadlines across Chennai wards." },
      { property: "og:title", content: "Recommended Actions — ThermoShield" },
      { property: "og:description", content: "Track operational heatwave interventions and response deadlines." },
    ],
  }),
  component: () => <AuthenticatedPage path="/recommended-actions"><ActionsModule /></AuthenticatedPage>,
});

const STATUS_LABEL: Record<ActionStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function ActionsModule() {
  const query = useQuery({ queryKey: ["actions"], queryFn: () => actionsApi.list() });
  const [updating, setUpdating] = useState<string | null>(null);

  async function advance(action: InterventionAction) {
    const next: Record<ActionStatus, ActionStatus> = { PENDING: "IN_PROGRESS", IN_PROGRESS: "COMPLETED", COMPLETED: "COMPLETED", CANCELLED: "CANCELLED" };
    if (next[action.status] === action.status) return;
    setUpdating(action.id);
    try {
      await actionsApi.update(action.id, { status: next[action.status] });
      await query.refetch();
    } finally {
      setUpdating(null);
    }
  }

  return <div className="space-y-6">
    <PageHeader title="Recommended Actions" description="Prioritised heatwave interventions with accountable officers, response windows and current status." meta={query.data ? `${query.data.filter((item) => item.status === "PENDING").length} pending actions` : undefined} actions={<Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>Refresh actions</Button>} />
    <PrototypeNotice />
    <QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={6}>
      <section aria-label="Recommended interventions" className="space-y-3">
        {query.data?.map((action) => <article key={action.id} className="gov-panel p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-foreground">{action.title}</h2><span className="rounded-sm border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{STATUS_LABEL[action.status]}</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{action.location} · {action.responsibleOfficer}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void advance(action)} disabled={updating === action.id || action.status === "COMPLETED" || action.status === "CANCELLED"}>
              {updating === action.id ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}
              {action.status === "PENDING" ? "Acknowledge" : action.status === "IN_PROGRESS" ? "Mark complete" : "Completed"}
            </Button>
          </div>
          <div className="mt-4 grid gap-3 border-t border-border pt-3 text-sm sm:grid-cols-3"><div><p className="gov-section-title">Response window</p><p className="mt-1 font-medium text-foreground">{action.window.replaceAll("_", " ")}</p></div><div><p className="gov-section-title">Deadline</p><p className="mt-1 inline-flex items-center gap-1 text-foreground"><Clock3 className="size-3.5" aria-hidden="true" />{action.deadline}</p></div><div><p className="gov-section-title">Action ID</p><p className="mt-1 gov-data text-foreground">{action.id}</p></div></div>
          {action.notes ? <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">Note: {action.notes}</p> : null}
        </article>)}
      </section>
    </QueryBoundary>
  </div>;
}