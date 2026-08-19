import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { AiDisclaimer, PageHeader } from "@/components/AppShell";
import { PageContainer } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatReply } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a workplace productivity assistant for drafting, planning, prioritising and thinking through work problems.",
      },
      { property: "og:title", content: "AI Assistant Chat — Workplace AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Help me prioritise my week",
  "Rewrite this update to be more concise",
  "Prepare 5 questions for a vendor call",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = useServerFn(chatReply);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: result.text }]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The assistant is unavailable right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Bot}
        title="AI Assistant Chat"
        description="Ask anything about your work — drafting, planning, summarising or thinking out loud."
      />

      <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="size-6" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start a conversation. The assistant keeps the full thread in context.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => void submit(s)}
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-surface-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "prose-ai max-w-[85%] rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-surface-foreground"
                  }
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === "user" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Thinking…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-background/60 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              rows={2}
              placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit(input);
                }
              }}
              className="min-h-[52px] resize-none"
            />
            <Button onClick={() => void submit(input)} disabled={loading || !input.trim()}>
              <SendHorizonal className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>

      <AiDisclaimer />
    </PageContainer>
  );
}
