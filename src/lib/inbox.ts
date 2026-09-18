import type { BagSignup } from "./signups";

const KEY = "solvay-bag-inbox";

export function readInbox(): BagSignup[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BagSignup[]) : [];
  } catch {
    return [];
  }
}

export function writeInbox(rows: BagSignup[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function pushInbox(row: BagSignup) {
  writeInbox([...readInbox(), row]);
}

export function patchInbox(id: string, status: string) {
  writeInbox(readInbox().map((r) => (r.id === id ? { ...r, status } : r)));
}

export function mergeInbox(server: BagSignup[]) {
  const byId = new Map<string, BagSignup>();
  for (const r of [...readInbox(), ...server]) byId.set(r.id, r);
  return [...byId.values()].sort((a, b) => a.tripDate.localeCompare(b.tripDate));
}