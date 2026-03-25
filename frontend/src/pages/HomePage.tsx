import { useEffect, useState, useRef, useCallback } from "react";
import { Hero } from "../components/Hero";
import { PaperCard } from "../components/PaperCard";
import type { Paper } from "../types";
import { fetchPapers, uploadPaper, batchImport } from "../lib/api";
import { useLivePaperListProgress } from "../hooks/useLivePaperProgress";
import { Upload, FolderInput } from "lucide-react";

export function HomePage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPapers = useCallback(async () => {
    try {
      const data = await fetchPapers();
      setPapers(data);
      return true;
    } catch (e) {
      console.error("Failed to load papers:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useLivePaperListProgress(papers, setPapers, loadPapers);

  useEffect(() => {
    void loadPapers();
  }, [loadPapers]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadPaper(file);
      await loadPapers();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleBatch() {
    setBatchLoading(true);
    try {
      const result = await batchImport();
      console.log("Batch result:", result);
      await loadPapers();
    } catch (err) {
      console.error("Batch import failed:", err);
    } finally {
      setBatchLoading(false);
    }
  }

  return (
    <>
      <Hero />

      <section className="section-container py-16 md:py-24">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
              Research Papers
            </h2>
            <p className="text-slate-500">
              Upload PDFs to extract structured COF data via AI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload PDF"}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <button
              onClick={handleBatch}
              disabled={batchLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <FolderInput className="h-4 w-4" />
              {batchLoading ? "Importing..." : "Batch Import"}
            </button>
          </div>
        </div>

        <div className="text-sm font-medium text-slate-400 mb-6 hidden sm:block">
          Showing {papers.length} papers
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="strategy-loader-wrap">
                <div className="strategy-loader-ring" />
                <div className="strategy-loader-ring strategy-loader-ring-delay" />
              </div>
              <div className="text-slate-400 font-medium mt-6">
                Loading papers...
              </div>
            </div>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm leading-relaxed">
            <p className="text-slate-600 font-medium text-lg">
              No papers yet.
            </p>
            <p className="text-slate-500 mt-2">
              Upload a PDF or batch-import from sample_papers to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {papers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
