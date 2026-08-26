import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/navigation";
import { ROLE_LABEL, useAuth } from "@/lib/auth";
import { USE_MOCK_DATA } from "@/api/client";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-5 p-3" aria-label="Primary">
      {NAV_GROUPS.map((group) => {
        const items = NAV_ITEMS.filter((n) => n.group === group && user && n.roles.includes(user.role));
        if (items.length === 0) return null;
        return (
          <div key={group}>
            <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-sidebar-foreground/55">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-sm px-2.5 py-2 text-sm transition-colors duration-150",
                        active
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-navy text-navy-foreground">
        <div className="flex h-14 items-center gap-3 px-3 md:px-5">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-navy-foreground hover:bg-navy-muted lg:hidden"
                aria-label="Open navigation menu"
              >
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="px-4 pt-4 text-sm font-semibold text-sidebar-foreground">
                ThermoShield navigation
              </SheetTitle>
              <NavList onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-navy-foreground/30 text-xs font-bold tracking-tight"
            >
              TS
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">
                ThermoShield
              </span>
              <span className="hidden truncate text-[11px] text-navy-foreground/70 sm:block">
                Heatwave Intelligence &amp; Early Warning Platform
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            {USE_MOCK_DATA ? (
              <span className="hidden rounded-sm border border-navy-foreground/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest md:inline">
                Prototype mode
              </span>
            ) : null}
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-tight">{user?.name}</p>
              <p className="text-[11px] leading-tight text-navy-foreground/70">
                {user ? ROLE_LABEL[user.role] : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-navy-foreground/35 bg-transparent text-navy-foreground hover:bg-navy-muted hover:text-navy-foreground"
              onClick={async () => {
                await logout();
                navigate({ to: "/" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar lg:block">
          <NavList />
        </aside>
        <main id="main-content" className="min-w-0 flex-1 px-3 py-5 md:px-6 md:py-6">
          <div className="mx-auto max-w-7xl space-y-5">{children}</div>
        </main>
      </div>

      <footer className="border-t border-border bg-surface px-4 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <p>ThermoShield — Heatwave Intelligence &amp; Early Warning Platform</p>
          <p>Restricted access. All activity is logged for audit purposes.</p>
        </div>
      </footer>
    </div>
  );
}
