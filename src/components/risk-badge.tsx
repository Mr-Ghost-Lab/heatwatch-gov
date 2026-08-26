import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const STYLES: Record<RiskLevel, string> = {
  LOW: "bg-risk-low-surface text-risk-low border-risk-low/30",
  MODERATE: "bg-risk-moderate-surface text-risk-moderate border-risk-moderate/30",
  HIGH: "bg-risk-high-surface text-risk-high border-risk-high/30",
  CRITICAL: "bg-risk-critical-surface text-risk-critical border-risk-critical/35",
};

const LABEL: Record<RiskLevel, string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  CRITICAL: "Critical",
};

export function RiskBadge({
  level,
  className,
  showDot = true,
}: {
  level: RiskLevel;
  className?: string | undefined;
  showDot?: boolean | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        STYLES[level],
        className,
      )}
    >
      {showDot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {LABEL[level]} risk
    </span>
  );
}

export const RISK_LABEL = LABEL;
