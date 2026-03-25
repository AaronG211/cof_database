import { useState } from "react";
import { Search, Hexagon } from "lucide-react";
import { searchCofs } from "../lib/api";
import type { COFMaterial } from "../types";

export function SearchPage() {
  const [results, setResults] = useState<COFMaterial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [cofName, setCofName] = useState("");
  const [linkage, setLinkage] = useState("");
  const [dimension, setDimension] = useState("");
  const [betMin, setBetMin] = useState("");
  const [betMax, setBetMax] = useState("");
  const [gas, setGas] = useState("");

  async function handleSearch() {
    setIsSearching(true);
    setSearched(true);
    try {
      const params: Record<string, string> = {};
      if (cofName) params.cof_name = cofName;
      if (linkage) params.linkage = linkage;
      if (dimension) params.dimension = dimension;
      if (betMin) params.bet_min = betMin;
      if (betMax) params.bet_max = betMax;
      if (gas) params.gas = gas;

      const data = await searchCofs(params);
      setResults(data);
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="section-container py-10 md:py-16">
      <header className="mb-8 reveal-up">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-2">
          Search COFs
        </h1>
        <p className="text-slate-500">
          Query extracted COF materials by properties.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 reveal-up reveal-delay-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              COF Name
            </label>
            <input
              type="text"
              value={cofName}
              onChange={(e) => setCofName(e.target.value)}
              placeholder="e.g., COF-5"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              Linkage Type
            </label>
            <input
              type="text"
              value={linkage}
              onChange={(e) => setLinkage(e.target.value)}
              placeholder="e.g., Imine"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              Dimension
            </label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Any</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              BET Min (m²/g)
            </label>
            <input
              type="number"
              value={betMin}
              onChange={(e) => setBetMin(e.target.value)}
              placeholder="e.g., 500"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              BET Max (m²/g)
            </label>
            <input
              type="number"
              value={betMax}
              onChange={(e) => setBetMax(e.target.value)}
              placeholder="e.g., 3000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
              Gas Type
            </label>
            <input
              type="text"
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              placeholder="e.g., CO2"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="reveal-up">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Results ({results.length})
          </h2>
          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">
                No COFs found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">COF Name</th>
                    <th className="px-4 py-3">Linkage</th>
                    <th className="px-4 py-3">Dim</th>
                    <th className="px-4 py-3">BET (m²/g)</th>
                    <th className="px-4 py-3">Pore Size</th>
                    <th className="px-4 py-3">Td (°C)</th>
                    <th className="px-4 py-3">Topology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((cof) => (
                    <tr
                      key={cof.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Hexagon className="h-4 w-4 text-blue-400" />
                          {cof.cof_name || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cof.linkage_type || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cof.dimension || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {cof.bet_surface_area ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cof.pore_size
                          ? `${cof.pore_size} ${cof.pore_size_unit || "nm"}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cof.thermal_stability_celsius ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cof.topology || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
