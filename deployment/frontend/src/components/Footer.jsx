import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="IT Career Matcher" className="h-8 w-8 rounded-lg" />
            <div>
              <p className="font-display font-bold text-slate-800">IT Career Matcher</p>
              <p className="text-xs text-slate-400">Rekomendasi Karir IT berbasis Machine Learning</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/input" className="hover:text-brand-600">Input</Link>
                <Link to="/riwayat" className="hover:text-brand-600">Riwayat</Link>
              </>
            ) : (
              <Link to="/login" className="hover:text-brand-600">Login</Link>
            )}
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} IT Career Matcher · React + Vite · Express · FastAPI · PostgreSQL
        </div>
      </div>
    </footer>
  );
}
