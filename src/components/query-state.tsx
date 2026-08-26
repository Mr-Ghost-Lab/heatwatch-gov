import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function LoadingPanel({ rows = 4, label = "Loading data" }: { rows?: number | undefined; label?: string | undefined }) {
  return (
    <div className="gov-panel p-4" role="status" aria-live="polite" aria-label={label}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{label}…</p>
    </div>
  );
}

export function ErrorPanel({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: (() => void) | undefined;
}) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred while retrieving data.";
  return (
    <div className="gov-panel border-destructive/40 bg-destructive/5 p-4" role="alert">
      <h2 className="text-sm font-semibold text-destructive">Data could not be retrieved</h2>
      <p className="mt-1 text-sm text-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Retry request
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="gov-panel p-6 text-center">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function QueryBoundary({
  isPending,
  error,
  refetch,
  children,
  rows,
}: {
  isPending: boolean;
  error: unknown;
  refetch?: (() => void) | undefined;
  children: ReactNode;
  rows?: number | undefined;
}) {
  if (isPending) return <LoadingPanel rows={rows} />;
  if (error) return <ErrorPanel error={error} onRetry={refetch} />;
  return <>{children}</>;
}
