import type { COFMaterial, Paper } from "../types";

const BASE = "/api";

interface UploadPaperResponse {
  id: string;
  status: string;
}

interface BatchImportResponse {
  imported: number;
  skipped: number;
  total_files: number;
}

interface PaperProgressEvent {
  pct: number;
  step: string;
}

export async function fetchPapers(): Promise<Paper[]> {
  const res = await fetch(`${BASE}/papers`);
  if (!res.ok) throw new Error("Failed to fetch papers");
  return (await res.json()) as Paper[];
}

export async function fetchPaper(id: string): Promise<Paper> {
  const res = await fetch(`${BASE}/papers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch paper");
  return (await res.json()) as Paper;
}

export async function uploadPaper(file: File): Promise<UploadPaperResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/papers/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return (await res.json()) as UploadPaperResponse;
}

export async function batchImport(): Promise<BatchImportResponse> {
  const res = await fetch(`${BASE}/papers/batch`, { method: "POST" });
  if (!res.ok) throw new Error("Batch import failed");
  return (await res.json()) as BatchImportResponse;
}

export async function deletePaper(id: string): Promise<void> {
  const res = await fetch(`${BASE}/papers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

export async function searchCofs(params: Record<string, string>): Promise<COFMaterial[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/search?${qs}`);
  if (!res.ok) throw new Error("Search failed");
  return (await res.json()) as COFMaterial[];
}

export function subscribePaperProgress(
  paperId: string,
  onProgress: (pct: number, step: string) => void,
  onDone: () => void,
): () => void {
  const es = new EventSource(`${BASE}/papers/${paperId}/progress`);

  es.addEventListener("progress", (e) => {
    const data = JSON.parse(e.data) as PaperProgressEvent;
    onProgress(data.pct, data.step);
  });

  es.addEventListener("done", (e) => {
    const data = JSON.parse(e.data) as PaperProgressEvent;
    onProgress(data.pct, data.step);
    es.close();
    onDone();
  });

  es.onerror = () => {
    es.close();
    onDone();
  };

  return () => es.close();
}
