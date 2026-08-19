import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Copy,
  Download,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateOutput } from "@/lib/ai.functions";
import { addHistory, type HistoryKind } from "@/lib/history";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
  defaultValue?: string;
};

const refinements = [
  { label: "Shorter", instruction: "Make it noticeably shorter while keeping every fact and the key message." },
  { label: "More formal", instruction: "Rewrite in a more formal, corporate register." },
  { label: "Friendlier", instruction: "Rewrite in a warmer, friendlier tone without losing professionalism." },
  { label: "Improve grammar", instruction: "Fix grammar, punctuation and flow. Do not change meaning or add facts." },
] as const;

const REFINE_SYSTEM = `ROLE: You are a precise professional editor.
TASK: Rewrite the supplied draft according to the requested change.
REQUIREMENTS:
- Preserve all user-provided facts, names, numbers and dates
- Never invent new facts, sources or people
- Keep the original structure and formatting unless the change requires otherwise
- Return only the rewritten draft, no commentary`;

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  kind,
  emptyState,
  cta = "Generate",
  outputLabel = "AI draft (editable)",
  sidePanel,
}: {
  fields: Field[];
  system: string;
  buildPrompt: (get: (key: string) => string) => string;
  kind: HistoryKind;
  emptyState?: string;
  cta?: string;
  outputLabel?: string;
  sidePanel?: ReactNode | undefined;
}) {
  const initial = Object.fromEntries(
    fields.map((f) => [f.name, f.defaultValue ?? (f.type === "select" ? (f.options?.[0] ?? "") : "")]),
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const generate = useServerFn(generateOutput);

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const historyTitle = () => {
    const first = fields.find((f) => f.required);
    const raw = (first ? values[first.name] : "") ?? "";
    return raw.trim().slice(0, 60) || outputLabel;
  };

  async function run() {
    const missing = fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generate({
        data: { system, prompt: buildPrompt((key) => values[key] ?? "") },
      });
      setOutput(result.text);
      addHistory({ kind, title: historyTitle(), content: result.text });
      toast.success("AI output ready — review and edit before you use it");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "The AI request failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function refine(label: string, instruction: string) {
    if (!output.trim()) return;
    setRefining(label);
    setError(null);
    try {
      const result = await generate({
        data: {
          system: REFINE_SYSTEM,
          prompt: `REQUESTED CHANGE: ${instruction}\n\nDRAFT:\n${output}`,
        },
      });
      setOutput(result.text);
      toast.success(`Applied: ${label.toLowerCase()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The AI request failed.";
      setError(message);
      toast.error(message);
    } finally {
      setRefining(null);
    }
  }

  const busy = loading || refining !== null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-base font-semibold">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The more specific your inputs, the better the draft.
        </p>
        <div className="mt-5 space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {field.label}
                {field.required ? " *" : ""}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : field.type === "select" ? (
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(v) => set(field.name, v)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={run} disabled={busy}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "AI is thinking…" : output ? `Regenerate` : cta}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setValues(initial);
              setOutput("");
              setError(null);
            }}
            disabled={busy}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
        {sidePanel ? <div className="mt-5">{sidePanel}</div> : null}
      </section>

      <section className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{outputLabel}</h2>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!output}
              onClick={() => {
                void navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="size-4" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!output}
              onClick={() => {
                const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${kind}-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Exported as .txt");
              }}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!output || busy}
              onClick={() => {
                setOutput("");
                toast("Output cleared");
              }}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>
        </div>

        {output ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {refinements.map((r) => (
              <button
                key={r.label}
                type="button"
                disabled={busy}
                onClick={() => void refine(r.label, r.instruction)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-surface-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {refining === r.label ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Wand2 className="size-3" />
                )}
                {r.label}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => void run()}
            >
              Try again
            </button>
          </div>
        ) : null}

        {loading && !output ? (
          <div className="mt-4 flex-1 space-y-3 rounded-xl border border-dashed border-border p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              AI is thinking…
            </p>
            {[92, 80, 96, 60, 88, 72].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : (
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            aria-label={outputLabel}
            placeholder={
              emptyState ??
              "Your editable AI output will appear here. Every word stays fully editable before you use it."
            }
            className="mt-4 min-h-[420px] flex-1 resize-y font-sans text-sm leading-relaxed"
          />
        )}
        <AiDisclaimer className="mt-4" />
      </section>
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      {children}
    </div>
  );
}
