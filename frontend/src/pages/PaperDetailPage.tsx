import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Hexagon,
  Droplets,
  Microscope,
  Beaker,
  FileText,
  Quote,
  Activity,
} from "lucide-react";
import { fetchPaper } from "../lib/api";
import { ProgressBar } from "../components/ProgressBar";
import { useLivePaperProgress } from "../hooks/useLivePaperProgress";
import type { Paper, COFMaterial } from "../types";

function Val({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-700 font-medium">
        {value}
        {unit ? ` ${unit}` : ""}
      </p>
    </div>
  );
}

function COFSection({ cof, index }: { cof: COFMaterial; index: number }) {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6 reveal-up"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* COF Name Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 text-white text-sm font-bold">
          {index + 1}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            {cof.cof_name || "Unknown COF"}
          </h3>
          {cof.dimension && (
            <span className="badge mt-1">{cof.dimension}</span>
          )}
        </div>
      </div>

      {/* Chemical Identity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hexagon className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Chemical Identity
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Val label="Linkage Type" value={cof.linkage_type} />
          <Val label="Topology" value={cof.topology} />
          <Val label="Dimension" value={cof.dimension} />
          <Val label="Linker SMILES" value={cof.linker_smiles} />
        </div>
      </div>

      {/* Quantitative Properties */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Quantitative Properties
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Val
            label="BET Surface Area"
            value={cof.bet_surface_area}
            unit="m²/g"
          />
          <Val
            label="Pore Size"
            value={cof.pore_size}
            unit={cof.pore_size_unit || "nm"}
          />
          <Val
            label="Thermal Stability (Td)"
            value={cof.thermal_stability_celsius}
            unit="°C"
          />
          <Val label="Chemical Stability" value={cof.chemical_stability} />
        </div>
      </div>

      {/* Characterization */}
      {(cof.pxrd_peaks ||
        cof.pxrd_simulated_vs_experimental ||
        cof.n2_isotherm_description) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="h-4 w-4 text-violet-500" />
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Characterization
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Val label="PXRD Peaks (2θ)" value={cof.pxrd_peaks} />
            <Val
              label="Simulated vs Experimental"
              value={cof.pxrd_simulated_vs_experimental}
            />
            <Val
              label="N₂ Isotherm"
              value={cof.n2_isotherm_description}
            />
          </div>
        </div>
      )}

      {/* Synthesis Recipe */}
      {(cof.solvent_system ||
        cof.catalyst ||
        cof.reaction_temperature_celsius ||
        cof.reaction_time_hours) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Beaker className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Synthesis Recipe
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Val label="Solvent System" value={cof.solvent_system} />
            <Val label="Catalyst" value={cof.catalyst} />
            <Val
              label="Temperature"
              value={cof.reaction_temperature_celsius}
              unit="°C"
            />
            <Val
              label="Time"
              value={cof.reaction_time_hours}
              unit="hours"
            />
            <Val label="Conditions" value={cof.reaction_conditions} />
          </div>
        </div>
      )}

      {/* Gas Adsorption */}
      {cof.gas_adsorption.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="h-4 w-4 text-cyan-500" />
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Gas Adsorption
            </h4>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Gas</th>
                  <th className="px-4 py-3">Uptake</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Temperature</th>
                  <th className="px-4 py-3">Pressure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cof.gas_adsorption.map((g, gi) => (
                  <tr key={gi} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {g.gas || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {g.uptake ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {g.unit || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {g.temperature_k ? `${g.temperature_k} K` : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {g.pressure_bar ? `${g.pressure_bar} bar` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence */}
      {cof.evidence.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Quote className="h-4 w-4 text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Evidence
            </h4>
          </div>
          <div className="space-y-2">
            {cof.evidence.map((ev, ei) => (
              <div
                key={ei}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {ev.property_name}
                  </span>
                  {ev.page_number && (
                    <span className="text-xs text-slate-400">
                      p. {ev.page_number}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{ev.source_text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function PaperDetailPage() {
  const { paperId } = useParams();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPaper = useCallback(async () => {
    if (!paperId) {
      setError("Invalid paper ID");
      setIsLoading(false);
      return false;
    }
    try {
      const data = await fetchPaper(paperId);
      setPaper(data);
      setError("");
      return true;
    } catch {
      setError("Failed to load paper details.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [paperId]);

  useLivePaperProgress(paperId, paper, setPaper, loadPaper);

  useEffect(() => {
    void loadPaper();
  }, [loadPaper]);

  if (isLoading) {
    return (
      <section className="section-container py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-10">
          <div className="strategy-loader-wrap">
            <div className="strategy-loader-ring" />
            <div className="strategy-loader-ring strategy-loader-ring-delay" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="strategy-skeleton h-4 w-10/12" />
            <div className="strategy-skeleton h-4 w-8/12" />
            <div className="strategy-skeleton h-4 w-9/12" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !paper) {
    return (
      <section className="section-container py-16">
        <div className="bg-white rounded-xl border border-rose-200 p-8 text-rose-600">
          {error || "Paper not found."}
        </div>
      </section>
    );
  }

  const cofs = (paper.cofs || []) as COFMaterial[];

  return (
    <section className="section-container py-10 md:py-16">
      {/* Paper header */}
      <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-10 space-y-6 mb-8 reveal-up">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {paper.date && <span className="badge">{paper.date}</span>}
            {paper.doi && (
              <span className="text-xs font-medium text-slate-500 font-mono">
                DOI: {paper.doi}
              </span>
            )}
            <span className="badge">{paper.status}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
            {paper.title || paper.filename}
          </h1>
          {paper.authors && (
            <p className="text-slate-500 text-lg">{paper.authors}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {paper.page_count} pages
            </span>
            <span className="flex items-center gap-1">
              <Hexagon className="h-4 w-4" />
              {paper.cof_count} COFs
            </span>
          </div>
        </div>

        {/* Progress bar for processing papers */}
        {(paper.status === "processing" || paper.status === "pending") && (
          <ProgressBar
            pct={paper.progress_pct}
            step={paper.progress_step}
            status={paper.status}
          />
        )}

        {/* Summary */}
        {paper.summary && (
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-slate-900 uppercase mb-2">
              Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{paper.summary}</p>
          </div>
        )}

        {paper.error_message && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{paper.error_message}</p>
          </div>
        )}
      </article>

      {/* COF sections */}
      {cofs.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 reveal-up">
            COFs Discussed ({cofs.length})
          </h2>
          {cofs.map((cof, idx) => (
            <COFSection key={cof.id} cof={cof} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
}
