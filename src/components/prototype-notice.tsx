import { USE_MOCK_DATA } from "@/api/client";
import { cn } from "@/lib/utils";

/** Explicit, non-negotiable disclosure whenever simulated data is displayed. */
export function PrototypeNotice({ className }: { className?: string }) {
  if (!USE_MOCK_DATA) return null;
  return (
    <p
      className={cn(
        "gov-panel bg-risk-moderate-surface text-risk-moderate px-3 py-2 text-xs font-semibold uppercase tracking-wide",
        className,
      )}
      role="note"
    >
      Prototype — simulated data. Not for operational decision-making.
    </p>
  );
}

export function PrototypeTag({ className }: { className?: string }) {
  if (!USE_MOCK_DATA) return null;
  return (
    <span
      className={cn(
        "rounded-sm border border-risk-moderate/40 bg-risk-moderate-surface px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-risk-moderate",
        className,
      )}
    >
      Simulated
    </span>
  );
}
