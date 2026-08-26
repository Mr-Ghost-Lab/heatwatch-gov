import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = "neutral",
  footer,
}: {
  label: string;
  value: string | number;
  unit?: string | undefined;
  hint?: string | undefined;
  tone?: "neutral" | "low" | "moderate" | "high" | "critical" | "primary" | undefined;
  footer?: ReactNode | undefined;
}) {
  const toneClass = {
    neutral: "text-foreground",
    primary: "text-primary",
    low: "text-risk-low",
    moderate: "text-risk-moderate",
    high: "text-risk-high",
    critical: "text-risk-critical",
  }[tone];

  return (
    <div className="gov-panel p-4 transition-shadow duration-200 hover:shadow-sm">
      <p className="gov-section-title">{label}</p>
      <p className={cn("mt-2 text-2xl gov-data", toneClass)}>
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {footer ? <div className="mt-3 border-t border-border pt-2">{footer}</div> : null}
    </div>
  );
}
