import { BookOpen, Cpu, FlaskConical } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 border-b border-slate-200 hero-surface">
      <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl floating-orb" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl floating-orb floating-orb-delay" />
      <div className="section-container relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-slate-200/60 px-3 py-1 text-sm font-medium text-slate-800 mb-6 reveal-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            AI-Powered Extraction
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 mb-6 leading-tight reveal-up reveal-delay-1">
            Covalent Organic <br className="hidden md:block" /> Frameworks Database
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed reveal-up reveal-delay-2">
            Upload research papers and automatically extract structured COF
            data — chemical identity, porosity, stability, synthesis recipes,
            and characterization — all traced back to original text evidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div className="flex flex-col gap-2 feature-tile reveal-up reveal-delay-1">
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <BookOpen className="h-5 w-5 text-slate-700" />
                Paper-Centric
              </div>
              <p className="text-sm text-slate-600">
                Each paper is processed as a unit, with all COFs correctly
                linked to their source evidence.
              </p>
            </div>
            <div className="flex flex-col gap-2 feature-tile reveal-up reveal-delay-2">
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <Cpu className="h-5 w-5 text-slate-700" />
                AI Extraction
              </div>
              <p className="text-sm text-slate-600">
                GPT-powered pipeline extracts SMILES, topology, BET, PXRD, and
                synthesis recipes with evidence.
              </p>
            </div>
            <div className="flex flex-col gap-2 feature-tile reveal-up reveal-delay-3">
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <FlaskConical className="h-5 w-5 text-slate-700" />
                Structured Data
              </div>
              <p className="text-sm text-slate-600">
                Quantitative properties (S_BET, pore size, T_d) stored with
                units for searchable, comparable datasets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
