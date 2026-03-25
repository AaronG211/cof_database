interface ProgressBarProps {
  pct: number;
  step: string;
  status: string;
}

export function ProgressBar({ pct, step, status }: ProgressBarProps) {
  const safePct = Number.isFinite(pct) ? Math.min(Math.max(pct, 0), 100) : 0;

  if (status === "completed") return null;
  if (status === "failed") {
    return (
      <div className="mt-3" role="status" aria-live="polite">
        <div className="w-full bg-rose-100 rounded-full h-2">
          <div className="bg-rose-500 h-2 rounded-full w-full" />
        </div>
        <p className="text-xs text-rose-600 mt-1 font-medium">{step}</p>
      </div>
    );
  }

  const isActive = status === "processing";
  const barColor = isActive ? "bg-sky-500" : "bg-slate-300";
  const textColor = isActive ? "text-sky-700" : "text-slate-500";

  return (
    <div className="mt-3" role="status" aria-live="polite">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${textColor} truncate max-w-[70%]`}>
          {step}
        </span>
        <span className={`text-xs font-semibold ${textColor}`}>{safePct}%</span>
      </div>
      <div
        className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-label="Paper analysis progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePct}
        aria-valuetext={`${safePct}% - ${step}`}
      >
        <div
          className={`${barColor} h-2 rounded-full progress-bar-fill ${isActive ? "progress-pulse" : ""}`}
          style={{ width: `${Math.max(safePct, 2)}%` }}
        />
      </div>
    </div>
  );
}
