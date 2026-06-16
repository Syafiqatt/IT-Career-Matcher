import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaCircleCheck } from "react-icons/fa6";

const POINTS = [
  "Rekomendasi karir berbasis machine learning",
  "Simpan & kelola riwayat pribadimu",
  "Insight skill & roadmap belajar",
];

/** Layout dua kolom untuk halaman login/register. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white/80 shadow-card lg:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-10 text-white lg:flex">
          <div className="absolute -top-16 -left-12 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-blob" />
          <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-accent-400/30 blur-3xl animate-blob" />
          <Link to="/" className="relative flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><FaRocket /></span>
            <span className="font-display text-lg font-bold">IT Career Matcher</span>
          </Link>
          <div className="relative">
            <h2 className="font-display text-3xl font-bold leading-snug">Temukan jalur karir IT terbaikmu dengan AI.</h2>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-white/90">
                  <FaCircleCheck className="shrink-0 text-white" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-sm text-white/60">© {new Date().getFullYear()} IT Career Matcher</p>
        </div>

        {/* Form panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
