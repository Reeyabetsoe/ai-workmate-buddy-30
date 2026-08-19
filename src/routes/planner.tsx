import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { PageContainer, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Break a goal into a prioritised, time-boxed task plan with dependencies, effort estimates and a suggested schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "Turn goals into prioritised, time-boxed plans you can edit and share.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={CalendarCheck}
        title="AI Task Planner"
        description="Turn a goal into a prioritised plan with owners, effort estimates and a realistic schedule."
      />
      <ToolWorkspace
        kind="task"
        cta="Build plan"
        outputLabel="Task plan (editable)"
        system="You are a pragmatic project planner. Produce a prioritised plan as a markdown table (Task, Priority, Owner, Estimate, Due) followed by a short sequencing note and identified risks. Keep plans realistic for the stated capacity."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", rows: 4, required: true, placeholder: "Launch the internal onboarding portal" },
          { name: "deadline", label: "Deadline", placeholder: "e.g. 12 September" },
          { name: "capacity", label: "Available time", placeholder: "e.g. 6 hours/week, team of 3" },
          { name: "horizon", label: "Planning horizon", type: "select", options: ["Today", "This week", "Two weeks", "This month", "This quarter"] },
          { name: "constraints", label: "Constraints & context", type: "textarea", rows: 4, placeholder: "Dependencies, approvals, blocked periods…" },
        ]}
        buildPrompt={(v) =>
          [
            `Create a task plan.`,
            `Goal: ${v("goal")}`,
            `Planning horizon: ${v("horizon")}`,
            v("deadline") ? `Deadline: ${v("deadline")}` : "",
            v("capacity") ? `Capacity: ${v("capacity")}` : "",
            v("constraints") ? `Constraints: ${v("constraints")}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        }
      />
    </PageContainer>
  );
}
