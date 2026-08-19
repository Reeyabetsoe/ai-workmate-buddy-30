import { useCallback, useEffect, useState } from "react";

export type Preferences = {
  name: string;
  email: string;
  defaultTone: string;
  defaultLength: string;
  creativity: "Precise" | "Balanced" | "Creative";
  emailNotifications: boolean;
  taskReminders: boolean;
  completionAlerts: boolean;
};

export const defaultPreferences: Preferences = {
  name: "Reabetsoe",
  email: "you@company.com",
  defaultTone: "Professional",
  defaultLength: "Medium",
  creativity: "Balanced",
  emailNotifications: true,
  taskReminders: true,
  completionAlerts: false,
};

const KEY = "wai.preferences";
const EVENT = "wai:preferences";

function read(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    setPrefs(read());
    const handler = () => setPrefs(read());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    const next = { ...read(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setPrefs(next);
  }, []);

  return { prefs, update };
}
