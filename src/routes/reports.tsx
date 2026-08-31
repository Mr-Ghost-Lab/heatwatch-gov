import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/api/reportsApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";
import { Button } from "@/components/ui/button";
import type { ReportDefinition } from "@/types";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Heatwave Reports — ThermoShield" },
    { name: "description", content: "Review operational, forecast, health and response reports for the heat action plan." },
    { property: "og:title", content: "Heatwave Reports — ThermoShield" },
    { property: "og:description", content: "Generate and review ThermoShield operational reports." },
  ] }),
  component: () => <AuthenticatedPage path="/reports"><ReportsModule /></AuthenticatedPage>,
});

function ReportsModule() {
  const query = useQuery({ queryKey: ["reports"], queryFn: () => reportsApi.list() });
  const [generating, setGenerating] = useState<string | null>(null);
  async function generate(report: ReportDefinition) {
    setGenerating(report.id);
    try { await reportsApi.generate({ reportId: report.id, period: report.period }); await query.refetch(); } finally { setGenerating(null); }
  }
  return <div className="space-y-6"><PageHeader title="Reports" description="Access the reporting catalogue for operational, forecast, health and response review." meta={query.data ? `${query.data.length} report definitions` : undefined} /><PrototypeNotice /><QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={5}>{query.data ? <section aria-label="Report catalogue" className="grid gap-3 lg:grid-cols-2">{query.data.map((report) => <article key={report.id} className="gov-panel p-4"><div className="flex items-start gap-3"><FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-foreground">{report.name}</h2><span className="rounded-sm border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{report.format}</span></div><p className="mt-1 text-sm text-muted-foreground">{report.type} · {report.period}</p><p className="mt-2 text-xs text-muted-foreground">{report.generatedAt ? `Last generated ${new Date(report.generatedAt).toLocaleString("en-IN")}` : "Not generated"}</p></div></div><div className="mt-4 border-t border-border pt-3"><Button variant="outline" size="sm" onClick={() => void generate(report)} disabled={generating === report.id || report.status === "GENERATING"}>{generating === report.id || report.status === "GENERATING" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}{report.status === "AVAILABLE" ? "Regenerate" : "Generate report"}</Button></div></article>)}</section> : null}</QueryBoundary></div>;
}