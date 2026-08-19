import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { PageContainer, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a structured summary with decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and owners.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes and get decisions, action items, owners and open questions."
      />
      <ToolWorkspace
        kind="meeting"
        cta="Summarize notes"
        outputLabel="Summary (editable)"
        system="You are a meticulous meeting analyst. Summarise notes into: Overview, Key Decisions, Action Items (owner + due date when stated), Risks/Blockers, and Open Questions. Never invent owners or dates — write 'unassigned' or 'no date' instead."
        fields={[
          { name: "title", label: "Meeting title", placeholder: "e.g. Q3 Roadmap Review" },
          { name: "attendees", label: "Attendees", placeholder: "e.g. Thabo, Lerato, Sam" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, required: true, placeholder: "Paste your notes here…" },
          { name: "detail", label: "Summary depth", type: "select", options: ["Executive brief", "Balanced", "Detailed minutes"] },
        ]}
        buildPrompt={(v) =>
          [
            `Summarize the following meeting.`,
            v("title") ? `Title: ${v("title")}` : "",
            v("attendees") ? `Attendees: ${v("attendees")}` : "",
            `Depth: ${v("detail")}`,
            `Notes:\n${v("notes")}`,
          ]
            .filter(Boolean)
            .join("\n")
        }
      />
    </PageContainer>
  );
}
