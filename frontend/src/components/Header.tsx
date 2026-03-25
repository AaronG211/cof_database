import { Database } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 reveal-up">
          <Database className="h-6 w-6 text-slate-900 transition-transform duration-300 hover:rotate-6" />
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            COF <span className="font-light text-slate-600">DataBase</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            to="/papers"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Papers
          </Link>
          <Link
            to="/search"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
