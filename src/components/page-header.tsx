import type { ReactNode } from "react";
import { PrototypeTag } from "./prototype-notice";

export function PageHeader({
  title,
  description,
  meta,
  actions,
}: {
  title: string;
  description: string;
  meta?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-2">
          <h1 className="gov-page-title">{title}</h1>
          <PrototypeTag />
        </div>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        {meta ? <p className="mt-1 text-xs text-muted-foreground gov-data">{meta}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
