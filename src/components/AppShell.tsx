import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  Clock,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Settings,
  ShieldAlert,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useHistory } from "@/lib/history";
import { usePreferences } from "@/lib/preferences";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chat", icon: Bot },
] as const;

const secondaryItems = [
  { to: "/history", label: "History", icon: Clock },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: LifeBuoy },
] as const;

function NavList({
  items,
  onNavigate,
}: {
  items: readonly { to: string; label: string; icon: typeof Mail }[];
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              active &&
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--color-sidebar-primary)]",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={resolved === "dark" ? "Light mode" : "Dark mode"}
      className={cn(
        "grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent/10",
        className,
      )}
    >
      {resolved === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function UsageMeter() {
  const { entries } = useHistory();
  const used = Math.min(1000, 120 + entries.length * 12);
  const pct = Math.round((used / 1000) * 100);

  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3">
      <div className="flex items-center justify-between text-xs font-semibold text-sidebar-foreground">
        <span>AI Usage</span>
        <span>{pct}%</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sidebar-border/70"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Monthly AI usage"
      >
        <div
          className="h-full rounded-full bg-sidebar-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-sidebar-foreground/65">{used} / 1000 credits used</p>
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { prefs } = usePreferences();
  const initials = prefs.name.trim().slice(0, 2).toUpperCase() || "AI";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-sidebar p-4">
      <div className="mb-6 flex items-center gap-2.5 px-2 pt-1">
        <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Bot className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-sidebar-foreground">
            AI Workplace
          </p>
          <p className="text-xs text-sidebar-foreground/60">Productivity Assistant</p>
        </div>
      </div>

      <NavList items={navItems} onNavigate={onNavigate} />

      <div className="my-4 border-t border-sidebar-border/70 pt-4">
        <p className="mb-1 px-3 text-[0.65rem] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
          Workspace
        </p>
        <NavList items={secondaryItems} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-3">
        <UsageMeter />
        <div className="flex items-center gap-2.5 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/30 p-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sidebar-primary/15 text-xs font-semibold text-sidebar-primary">
            {initials}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">{prefs.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{prefs.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen lg:block">
        <SidebarBody />
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground"
        >
          <Menu className="size-4" />
        </button>
        <span className="font-display text-sm font-semibold">AI Workplace</span>
        <ThemeToggle className="ml-auto" />
      </header>

      <div className="pointer-events-none sticky top-0 z-20 hidden justify-end px-6 pt-5 lg:flex">
        <ThemeToggle className="pointer-events-auto shadow-card" />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40 animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-panel animate-in slide-in-from-left duration-200">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main id="main" className="min-w-0 lg:-mt-14">
        {children}
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:grid">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AiDisclaimer({ className }: { className?: string | undefined }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-px size-3.5 shrink-0 text-primary" />
      <span>
        <strong className="font-semibold text-foreground">Responsible AI:</strong> AI-generated
        content may contain errors or omissions. Review it before using it for business, legal,
        financial, HR or compliance decisions, and never paste confidential data into prompts.
      </span>
    </p>
  );
}
