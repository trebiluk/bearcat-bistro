const DB = "bearcat-bistro";
const STORE = "fs";
const HANDLE_KEY = "backup-dir";
export const FOLDER_NAME_KEY = "solvay-lunch-folder-name";

type DirHandle = FileSystemDirectoryHandle & {
  queryPermission: (opts: { mode: "read" | "readwrite" }) => Promise<"granted" | "denied" | "prompt">;
  requestPermission: (opts: { mode: "read" | "readwrite" }) => Promise<"granted" | "denied" | "prompt">;
  entries: () => AsyncIterableIterator<[string, FileSystemHandle]>;
};

export function folderApiOk() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(): Promise<DirHandle | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(HANDLE_KEY);
    req.onsuccess = () => resolve((req.result as DirHandle) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(handle: DirHandle) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbClear() {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function rememberedFolderName() {
  try {
    return localStorage.getItem(FOLDER_NAME_KEY) || "";
  } catch {
    return "";
  }
}

export async function pickBackupFolder() {
  const picker = (window as Window & { showDirectoryPicker?: (opts?: object) => Promise<DirHandle> }).showDirectoryPicker;
  if (!picker) throw new Error("This browser cannot keep a folder. Use Edge on the office PC.");
  const handle = (await picker({ id: "bearcat-bistro-backups", mode: "readwrite", startIn: "documents" })) as DirHandle;
  await idbSet(handle);
  localStorage.setItem(FOLDER_NAME_KEY, handle.name);
  return handle;
}

export async function clearBackupFolder() {
  await idbClear();
  try {
    localStorage.removeItem(FOLDER_NAME_KEY);
  } catch {
    /* */
  }
}

export async function loadBackupFolder() {
  const handle = (await idbGet()) as DirHandle | null;
  if (!handle) return null;
  if (!(await ensureRw(handle))) return null;
  localStorage.setItem(FOLDER_NAME_KEY, handle.name);
  return handle;
}

export async function ensureRw(handle: DirHandle) {
  const q = await handle.queryPermission({ mode: "readwrite" });
  if (q === "granted") return true;
  const r = await handle.requestPermission({ mode: "readwrite" });
  return r === "granted";
}

export function backupFileName(at = new Date()) {
  const day = at.toISOString().slice(0, 10);
  const hm = at.toISOString().slice(11, 16).replace(":", "");
  return `solvay-lunch-backup-${day}_${hm}.json`;
}

export async function writeBackupFile(handle: DirHandle, data: unknown, name?: string) {
  if (!(await ensureRw(handle))) throw new Error("Folder permission was denied.");
  const fileName = name || backupFileName();
  const file = await handle.getFileHandle(fileName, { create: true });
  const w = await file.createWritable();
  await w.write(typeof data === "string" ? data : JSON.stringify(data, null, 2));
  await w.close();
  return fileName;
}

export async function listBackupFiles(handle: DirHandle) {
  if (!(await ensureRw(handle))) return [];
  const out: { name: string; at: number }[] = [];
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind !== "file" || !name.endsWith(".json")) continue;
    const file = await (entry as FileSystemFileHandle).getFile();
    out.push({ name, at: file.lastModified });
  }
  return out.sort((a, b) => b.at - a.at);
}

export async function readBackupFile(handle: DirHandle, name: string) {
  if (!(await ensureRw(handle))) throw new Error("Folder permission was denied.");
  const file = await (await handle.getFileHandle(name)).getFile();
  return JSON.parse(await file.text()) as unknown;
}
