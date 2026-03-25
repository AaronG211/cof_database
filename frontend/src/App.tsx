import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { PaperDetailPage } from "./pages/PaperDetailPage";
import { PapersDictionaryPage } from "./pages/PapersDictionaryPage";
import { SearchPage } from "./pages/SearchPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/papers" element={<PapersDictionaryPage />} />
          <Route path="/paper/:paperId" element={<PaperDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <div className="section-container text-center">
          <p className="text-sm text-slate-500 font-medium">
            COF Database &mdash; AI-Powered Covalent Organic Framework Research
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
