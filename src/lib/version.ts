import { BACKUP_VERSION, PERSIST_KEY, SHADOW_KEY } from "./backup";
import { CYCLE, FIRST_STUDENT, LAST_STUDENT, YEAR_DAYS, officialStatus } from "./data";
import { BRAND } from "./brand";

export const APP_NAME = BRAND.name;
export const APP_VERSION = "2026.09.23-place";
export const APP_CHANNEL = import.meta.env.DEV ? "preview" : "live";

export function storageReport() {
  if (typeof window === "undefined") return { ok: false, bytes: 0, keys: [] as string[] };
  try {
    let bytes = 0;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      keys.push(k);
      bytes += (localStorage.getItem(k) ?? "").length;
    }
    return { ok: true, bytes, keys: keys.sort() };
  } catch {
    return { ok: false, bytes: 0, keys: [] as string[] };
  }
}

export function selfCheck() {
  const store = storageReport();
  const rows: { ok: boolean; name: string; detail: string }[] = [
    { ok: YEAR_DAYS.length >= 170, name: "School year days", detail: `${YEAR_DAYS.length} weekdays baked in` },
    { ok: FIRST_STUDENT === "2026-09-08", name: "First student day", detail: FIRST_STUDENT },
    { ok: LAST_STUDENT === "2027-06-24", name: "Last student day", detail: LAST_STUDENT },
    { ok: officialStatus("2026-09-06") === "Weekend", name: "Sunday is weekend", detail: officialStatus("2026-09-06") },
    { ok: officialStatus("2026-09-05") === "Weekend", name: "Saturday is weekend", detail: officialStatus("2026-09-05") },
    { ok: officialStatus("2026-10-30", "ses") === "Breakfast only", name: "Oct 30 SES half day", detail: officialStatus("2026-10-30", "ses") },
    { ok: officialStatus("2026-10-30", "sms") === "Serve", name: "Oct 30 SMS lunch", detail: officialStatus("2026-10-30", "sms") },
    { ok: officialStatus("2026-09-07") === "Holiday", name: "Labor Day", detail: officialStatus("2026-09-07") },
    { ok: CYCLE.length === 4 && CYCLE.every((r) => r.length === 5), name: "4-week cycle", detail: `${CYCLE.length}×${CYCLE[0]?.length ?? 0}` },
    { ok: store.ok, name: "Browser storage", detail: store.ok ? `${store.keys.length} keys · ${Math.round(store.bytes / 1024)} KB` : "blocked" },
    { ok: store.keys.includes(PERSIST_KEY) || store.keys.includes(SHADOW_KEY), name: "Desk backup keys", detail: `${PERSIST_KEY} / ${SHADOW_KEY}` },
    { ok: BACKUP_VERSION === 1, name: "Backup format", detail: `v${BACKUP_VERSION}` },
  ];
  return rows;
}

export function versionLabel() {
  return `${APP_NAME} ${APP_VERSION} · ${APP_CHANNEL}`;
}
