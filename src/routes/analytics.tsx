import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsApi } from "@/api/analyticsApi";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { QueryBoundary } from "@/components/query-state";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [
    { title: "Heatwave Analytics — ThermoShield" },
    { name: "description", content: "Analyse heat-risk trends, ward comparisons, health impact and intervention completion." },
    { property: "og:title", content: "Heatwave Analytics — ThermoShield" },
    { property: "og:description", content: "Operational analytics for heatwave risk and response." },
  ] }),
  component: () => <AuthenticatedPage path="/analytics"><AnalyticsModule /></AuthenticatedPage>,
});

function AnalyticsModule() {
  const query = useQuery({ queryKey: ["analytics", "overview"], queryFn: () => analyticsApi.getOverview() });
  return <div className="space-y-6"><PageHeader title="Analytics" description="Review changes in heat risk, health impact, ward exposure and intervention delivery." meta="Operational intelligence · Current season" /><PrototypeNotice /><QueryBoundary isPending={query.isPending} error={query.error} refetch={() => void query.refetch()} rows={6}>{query.data ? <div className="space-y-4"><section aria-label="Risk and temperature trend" className="gov-panel p-4"><p className="gov-section-title">14-day risk and temperature trend</p><div className="mt-4 h-[280px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={query.data.riskTrend}><CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis yAxisId="risk" tick={{ fontSize: 11 }} /><YAxis yAxisId="temperature" orientation="right" tick={{ fontSize: 11 }} /><Tooltip /><Line yAxisId="risk" type="monotone" dataKey="riskIndex" name="Risk index" stroke="hsl(var(--chart-1))" strokeWidth={2} /><Line yAxisId="temperature" type="monotone" dataKey="temperatureC" name="Temperature °C" stroke="hsl(var(--chart-2))" strokeWidth={2} /></LineChart></ResponsiveContainer></div></section><div className="grid gap-4 lg:grid-cols-2"><section aria-label="Ward comparison" className="gov-panel p-4"><p className="gov-section-title">Ward risk comparison</p><div className="mt-4 h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={query.data.wardComparison} layout="vertical" margin={{ left: 4, right: 12 }}><CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="ward" width={42} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="riskIndex" name="Risk index" fill="hsl(var(--chart-1))" /></BarChart></ResponsiveContainer></div></section><section aria-label="Intervention completion" className="gov-panel p-4"><p className="gov-section-title">Intervention completion</p><ul className="mt-4 space-y-3">{query.data.interventionCompletion.map((item) => <li key={item.status}><div className="flex justify-between text-sm"><span className="font-medium text-foreground">{item.status.replaceAll("_", " ")}</span><span className="gov-data text-muted-foreground">{item.count}</span></div><div className="mt-1 h-2 rounded-sm bg-muted"><div className="h-full rounded-sm bg-primary" style={{ width: `${Math.min(100, item.count * 2)}%` }} /></div></li>)}</ul></section></div></div> : null}</QueryBoundary></div>;
}