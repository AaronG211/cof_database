import { FileText, ArrowUpRight, FlaskConical, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Paper } from "../types";
import { ProgressBar } from "./ProgressBar";

interface PaperCardProps {
  paper: Paper;
  index?: number;
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Pending" },
    processing: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700", label: "Processing" },
    completed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Completed" },
    failed: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", label: "Failed" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export function PaperCard({ paper, index = 0 }: PaperCardProps) {
  return (
    <article
      className="card card-animate p-8"
      style={{ animationDelay: `${Math.min(index * 80, 480)}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {paper.date && <span className="badge">{paper.date}</span>}
            {paper.doi && (
              <span className="text-xs font-medium text-slate-500 font-mono">
                {paper.doi}
              </span>
            )}
            {statusBadge(paper.status)}
          </div>
          <Link to={`/paper/${paper.id}`}>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2 leading-tight hover:text-slate-700 transition-colors">
              {paper.title || paper.filename}
            </h2>
          </Link>
          {paper.authors && (
            <p className="text-sm text-slate-500 font-medium">
              {paper.authors}
            </p>
          )}
        </div>
        <div className="shrink-0 p-3 bg-slate-50 rounded-xl border border-slate-100 hidden md:block">
          <FileText className="h-6 w-6 text-slate-400" />
        </div>
      </div>

      {/* Progress bar for non-completed papers */}
      {paper.status !== "completed" && (
        <ProgressBar
          pct={paper.progress_pct}
          step={paper.progress_step}
          status={paper.status}
        />
      )}

      <div className="space-y-5 mt-4">
        {/* Summary */}
        {paper.summary && (
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase mb-2">
              Summary
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {paper.summary}
            </p>
          </div>
        )}

        {/* COFs overview */}
        {paper.cof_count > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hexagon className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  COFs Detected
                </h3>
              </div>
              <p className="text-2xl font-semibold text-slate-900">
                {paper.cof_count}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Status
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {paper.cof_count} material{paper.cof_count > 1 ? "s" : ""}{" "}
                extracted with structured properties
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Link
            to={`/paper/${paper.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
