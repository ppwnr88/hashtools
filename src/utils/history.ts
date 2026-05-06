import type { HistoryItem } from "../types";

const HISTORY_KEY = "wannarat-hash-tools-history";
const AUTO_COPY_KEY = "wannarat-hash-tools-auto-copy";

export function getHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">): HistoryItem[] {
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const history = [next, ...getHistory()].slice(0, 12);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getAutoCopy(): boolean {
  return localStorage.getItem(AUTO_COPY_KEY) === "true";
}

export function setAutoCopy(value: boolean): void {
  localStorage.setItem(AUTO_COPY_KEY, String(value));
}
