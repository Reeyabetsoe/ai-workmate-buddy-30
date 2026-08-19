import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
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

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  cta = "Generate",
  outputLabel = "AI draft (editable)",
  sidePanel,
}: {
  fields: Field[];
  system: string;
  buildPrompt: (get: (key: string) => string) => string;
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
  const generate = useServerFn(generateOutput);

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function run() {
    const missing = fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }
    setLoading(true);
    try {
      const result = await generate({
        data: { system, prompt: buildPrompt((key) => values[key] ?? "") },
      });
      setOutput(result.text);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

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
              <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
          <Button onClick={run} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Working…" : cta}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setValues(initial);
              setOutput("");
            }}
            disabled={loading}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
        {sidePanel ? <div className="mt-5">{sidePanel}</div> : null}
      </section>

      <section className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{outputLabel}</h2>
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
        </div>
        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your editable AI output will appear here. Every word stays fully editable before you use it."
          className="mt-4 min-h-[420px] flex-1 resize-y font-sans text-sm leading-relaxed"
        />
        <AiDisclaimer className="mt-4" />
      </section>
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>;
}
