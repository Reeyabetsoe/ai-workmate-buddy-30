import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";

import { AiDisclaimer } from "@/components/AppShell";
import { PageContainer } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday workplace tasks: draft emails, summarise meetings, plan work and research decisions with structured AI prompts and editable outputs.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "A clean SaaS dashboard for AI-assisted emails, meeting summaries, task plans, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Bullet points in, polished on-tone email out — subject line included.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Decisions, action items, owners and open questions from raw notes.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Break goals into prioritised, time-boxed tasks with realistic estimates.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefs with trade-offs and a clear list of things to verify.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "Assistant Chat",
    body: "A conversational co-worker that keeps the whole thread in context.",
  },
] as const;

function Dashboard() {
  return (
    <PageContainer>
      <section className="overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          Workplace automation
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Five focused AI workspaces for the admin that eats your day. Structured prompts,
          professional output, and everything editable before it leaves your hands.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Draft an email
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent/10"
          >
            Open assistant chat
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Workspaces</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Responsible AI use</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>Review and edit every output before sending or acting on it.</li>
          <li>Never paste confidential, personal or regulated data into prompts.</li>
          <li>Verify facts, figures and dates against a source of truth.</li>
          <li>Keep a human accountable for every decision the AI supports.</li>
        </ul>
        <AiDisclaimer className="mt-4 bg-card" />
      </section>
    </PageContainer>
  );
}
