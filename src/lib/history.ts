import { useCallback, useEffect, useState } from "react";

export type HistoryKind = "email" | "meeting" | "task" | "research" | "chat";

export type HistoryEntry = {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  createdAt: number;
};

const KEY = "wai.history";
const LIMIT = 100;
const EVENT = "wai:history";

export const kindLabels: Record<HistoryKind, string> = {
  email: "Email",
  meeting: "Meeting summary",
  task: "Task plan",
  research: "Research brief",
  chat: "Chat",
};

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, LIMIT)));
  window.dispatchEvent(new Event(EVENT));
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const item: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  write([item, ...read()]);
}

export function deleteHistory(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function clearHistory() {
  write([]);
}

export function formatWhen(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const yesterday = new Date(today.getTime() - 86_400_000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  if (yesterday) return `Yesterday, ${time}`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => setEntries(read()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  return { entries, refresh };
}
