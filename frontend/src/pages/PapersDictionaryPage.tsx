import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Filter, ListOrdered } from "lucide-react";
import { fetchPapers } from "../lib/api";
import { useLivePaperListProgress } from "../hooks/useLivePaperProgress";
import type { Paper } from "../types";
import { ProgressBar } from "../components/ProgressBar";

type DateSortOrder = "latest" | "earliest";
type StatusFilter = "All" | "pending" | "processing" | "completed" | "failed";

export function PapersDictionaryPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>("latest");
  const [motionSeed, setMotionSeed] = useState(0);

  const loadPapers = useCallback(async () => {
    try {
      const data = await fetchPapers();
      setPapers(data);
      setError("");
      return true;
    } catch {
      setError("Failed to load papers.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useLivePaperListProgress(papers, setPapers, loadPapers);

  useEffect(() => {
    void loadPapers();
  }, [loadPapers]);

  const filtered = useMemo(() => {
    let list =
      statusFilter === "All"
        ? papers
        : papers.filter((p) => p.status === statusFilter);

    list = [...list].sort((a, b) => {
      const aDate = Date.parse(a.date || "") || 0;
      const bDate = Date.parse(b.date || "") || 0;
      return dateSortOrder === "latest" ? bDate - aDate : aDate - bDate;
    });

    return list;
  }, [papers, statusFilter, dateSortOrder]);

  useEffect(() => {
    setMotionSeed((v) => v + 1);
  }, [statusFilter, dateSortOrder]);

  if (isLoading) {
    return (
      <section className="section-container py-16 md:py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="strategy-loader-wrap">
            <div className="strategy-loader-ring" />
            <div className="strategy-loader-ring strategy-loader-ring-delay" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-container py-16 md:py-20">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 text-rose-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-10 md:py-16">
      <header className="mb-8 md:mb-10 reveal-up">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <ListOrdered className="h-3.5 w-3.5" />
          Papers Dictionary
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 reveal-up reveal-delay-1">
          Research Inventory
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-600 reveal-up reveal-delay-2">
            One-row-per-paper index with sortable dates and status filters.
          </p>
          <span
            key={`count-${motionSeed}`}
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 inventory-count-chip"
          >
            Showing {filtered.length} papers
          </span>
        </div>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-2 reveal-up reveal-delay-1">
        <div className="rounded-xl border border-slate-200 bg-white p-4 inventory-filter-card">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sort by date
          </label>
          <select
            value={dateSortOrder}
            onChange={(e) =>
              setDateSortOrder(e.target.value as DateSortOrder)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 inventory-select"
          >
            <option value="latest">Latest to Earliest</option>
            <option value="earliest">Earliest to Latest</option>
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 inventory-filter-card">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 inline-flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filter by status
          </label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 inventory-select"
          >
            <option value="All">All</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm reveal-up reveal-delay-2">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">DOI / Filename</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">COFs</th>
              <th className="px-4 py-3">Progress</th>
            </tr>
          </thead>
          <tbody
            key={`tbody-${motionSeed}`}
            className="divide-y divide-slate-100"
          >
            {filtered.map((paper, index) => (
              <tr
                key={`${motionSeed}-${paper.id}`}
                className="inventory-row hover:bg-slate-50/80 transition-colors"
                style={{ "--i": Math.min(index, 16) } as CSSProperties}
              >
                <td className="px-4 py-4 font-mono text-xs text-slate-600 max-w-[200px] truncate">
                  {paper.doi || paper.filename}
                </td>
                <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                  {paper.date || "-"}
                </td>
                <td className="px-4 py-4 min-w-[300px]">
                  <Link
                    to={`/paper/${paper.id}`}
                    className="inline-flex items-center gap-1 text-slate-900 font-medium hover:text-slate-700 inventory-title-link"
                  >
                    {paper.title || paper.filename}
                    <ArrowUpRight className="h-3.5 w-3.5 inventory-link-arrow" />
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${
                      paper.status === "completed"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : paper.status === "processing"
                          ? "bg-sky-50 border-sky-200 text-sky-700"
                          : paper.status === "failed"
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}
                  >
                    {paper.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700 font-semibold">
                  {paper.cof_count}
                </td>
                <td className="px-4 py-4 min-w-[180px]">
                  {paper.status === "completed" ? (
                    <span className="text-xs text-emerald-600 font-medium">
                      Done
                    </span>
                  ) : paper.status === "failed" ? (
                    <span className="text-xs text-rose-600 font-medium">
                      Failed
                    </span>
                  ) : (
                    <ProgressBar
                      pct={paper.progress_pct}
                      step={paper.progress_step}
                      status={paper.status}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No papers match your current filter.
          </div>
        )}
      </div>
    </section>
  );
}
