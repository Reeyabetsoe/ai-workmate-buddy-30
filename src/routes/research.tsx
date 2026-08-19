import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { AiDisclaimer, PageHeader } from "@/components/AppShell";
import { PageContainer, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Get structured research briefs with key findings, comparisons, trade-offs and open questions to verify before you decide.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Structured research briefs with findings, trade-offs and verification notes.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get a structured briefing on any work topic, with explicit uncertainty and what to verify."
      />
      <ToolWorkspace
        cta="Run research brief"
        outputLabel="Research brief (editable)"
        system="You are a research analyst. Produce: Summary, Key Findings, Comparison or Options (table where useful), Trade-offs, Recommended next steps, and a 'Verify this' list. Clearly flag anything uncertain or time-sensitive. Do not fabricate statistics, citations or sources — say when a claim needs verification."
        fields={[
          { name: "topic", label: "Research question", type: "textarea", rows: 4, required: true, placeholder: "Which document e-signature tools fit a 40-person consultancy?" },
          { name: "audience", label: "Audience", placeholder: "e.g. exec committee, engineering team" },
          { name: "format", label: "Output format", type: "select", options: ["Briefing note", "Comparison table", "Pros & cons", "Bullet summary"] },
          { name: "depth", label: "Depth", type: "select", options: ["Quick scan", "Standard", "Deep dive"] },
        ]}
        sidePanel={<AiDisclaimer />}
        buildPrompt={(v) =>
          [
            `Research question: ${v("topic")}`,
            v("audience") ? `Audience: ${v("audience")}` : "",
            `Preferred format: ${v("format")}`,
            `Depth: ${v("depth")}`,
          ]
            .filter(Boolean)
            .join("\n")
        }
      />
    </PageContainer>
  );
}
