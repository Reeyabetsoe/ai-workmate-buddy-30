import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { PageContainer, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with tone, audience and intent controls, then edit every line before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Generate and edit professional emails with structured AI prompts.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Turn a few bullet points into a polished, on-tone email. Every draft stays editable."
      />
      <ToolWorkspace
        cta="Generate email"
        outputLabel="Email draft (editable)"
        system="You are an expert business communication writer. Write clear, concise workplace emails. Always include a subject line, greeting, body and sign-off. Avoid filler, avoid over-promising, and never invent facts that were not provided."
        fields={[
          { name: "recipient", label: "Recipient", placeholder: "e.g. Head of Finance", required: true },
          { name: "purpose", label: "Purpose / key points", type: "textarea", rows: 6, required: true, placeholder: "Request budget approval for Q3 tooling; cost R48k; deadline 30 June" },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
          { name: "sender", label: "Your name & role", placeholder: "e.g. Reabetsoe, Operations Lead" },
        ]}
        buildPrompt={(v) =>
          [
            `Write a workplace email.`,
            `Recipient: ${v("recipient")}`,
            `Purpose and key points: ${v("purpose")}`,
            `Tone: ${v("tone")}`,
            `Length: ${v("length")}`,
            v("sender") ? `Sign off as: ${v("sender")}` : "",
            `Return: a subject line, then the email body. Plain professional formatting.`,
          ]
            .filter(Boolean)
            .join("\n")
        }
      />
    </PageContainer>
  );
}
