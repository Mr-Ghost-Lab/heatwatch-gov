import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { canAccess } from "@/lib/navigation";
import { LoadingPanel } from "@/components/query-state";

/**
 * Client-side role guard. Renders the shell only for an authenticated user
 * whose role is permitted on this path.
 */
export function AuthenticatedPage({ path, children }: { path: string; children: ReactNode }) {
  const { user, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "anonymous") void navigate({ to: "/" });
  }, [status, navigate]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoadingPanel label="Verifying session" rows={3} />
      </div>
    );
  }

  if (!canAccess(user.role, path)) {
    return (
      <AppShell>
        <div className="gov-panel border-destructive/40 bg-destructive/5 p-6" role="alert">
          <h1 className="text-base font-semibold text-destructive">Access restricted</h1>
          <p className="mt-2 text-sm text-foreground">
            Your role does not have permission to view this module. Contact the platform administrator if
            you require access.
          </p>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
