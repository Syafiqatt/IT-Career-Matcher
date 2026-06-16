import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft, FaTrophy, FaWandMagicSparkles, FaRoad, FaMoneyBillTrendUp,
  FaLightbulb, FaCode, FaScrewdriverWrench, FaDatabase, FaCircleCheck,
} from "react-icons/fa6";
import { useApp } from "../context/AppContext.jsx";
import { getCareerMeta } from "../data/careerMeta.js";
import CircularProgress from "../components/CircularProgress.jsx";
import LoadingResult from "../components/LoadingResult.jsx";

const confidence = (s) =>
  s >= 0.8 ? "Sangat Tinggi" : s >= 0.6 ? "Tinggi" : s >= 0.4 ? "Sedang" : "Cukup";

const rankColors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-400 to-amber-600"];

export default function ResultPage() {
  const { result, loading, error } = useApp();

  if (loading)
    return (
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-slate-900">Hasil Rekomendasi</h1>
        <LoadingResult />
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 pb-10">
        <h1 className="mb-4 font-display text-3xl font-bold text-slate-900">Hasil Rekomendasi</h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        <Link to="/input" className="btn-ghost mt-5"><FaArrowLeft /> Kembali ke Form</Link>
      </div>
    );

  if (!result) return <Navigate to="/input" replace />;

  const recs = result.results || [];
  const top = recs[0] || {};
  const meta = getCareerMeta(top.career);
  const TopIcon = meta.icon;
  const skills = result.skills || [];
  const tools = result.tools || [];
  const databases = result.databases || [];

  const insight =
    `Berdasarkan kombinasi skill ${skills.slice(0, 4).join(", ") || "yang Anda pilih"}` +
    `${databases.length ? `, database ${databases.slice(0, 2).join(", ")}` : ""}, ` +
    `serta pengalaman coding ${result.years_code} tahun, Anda memiliki kecocokan ` +
    `${confidence(top.score || 0).toLowerCase()} pada jalur ${top.career}.`;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-slate-900">Hasil Rekomendasi</h1>
        <Link to="/input" className="btn-ghost !px-4 !py-2 text-sm"><FaArrowLeft /> Ubah Profil</Link>
      </div>

      {/* HERO MATCH CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] glass p-7 sm:p-9"
      >
        <div className={`absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br ${meta.color} opacity-20 blur-2xl`} />
        <div className="relative flex flex-col items-center gap-7 sm:flex-row">
          <CircularProgress value={(top.score || 0) * 100} label="kecocokan" />
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <FaTrophy /> BEST MATCH
            </span>
            <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow-soft`}>
                <TopIcon className="text-xl" />
              </span>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">{top.career}</h2>
            </div>
            <p className="mt-3 text-slate-600">{meta.desc}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start">
              <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">Confidence: {confidence(top.score || 0)}</span>
              <span className="flex items-center gap-1.5 text-slate-500"><FaMoneyBillTrendUp className="text-emerald-500" /> {meta.salary}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RANKING */}
      <section className="mt-8">
        <h3 className="mb-4 font-display text-xl font-bold text-slate-800">Peringkat Rekomendasi</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {recs.map((r, i) => {
            const m = getCareerMeta(r.career);
            const Icon = m.icon;
            return (
              <motion.div
                key={r.rank}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="group rounded-3xl border border-slate-100 bg-white/80 p-5 transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-white`}>
                    <Icon />
                    <span className={`absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${i < 3 ? `bg-gradient-to-br ${rankColors[i]}` : "bg-slate-400"}`}>
                      {r.rank}
                    </span>
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{r.career}</p>
                    <p className="text-xs text-slate-400">{m.salary}</p>
                  </div>
                  <span className="font-display text-lg font-extrabold text-slate-700">{(r.score * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(r.score * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SKILL ANALYSIS */}
      <section className="mt-8 rounded-[1.75rem] border border-slate-100 bg-white/80 p-6 sm:p-7">
        <h3 className="mb-5 font-display text-xl font-bold text-slate-800">Analisis Skill Anda</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <SkillGroup icon={FaCode} title="Skill & Bahasa" color="from-brand-500 to-indigo-600" items={skills} />
          <SkillGroup icon={FaScrewdriverWrench} title="Tools / IDE" color="from-accent-500 to-fuchsia-600" items={tools} />
          <SkillGroup icon={FaDatabase} title="Database" color="from-emerald-500 to-teal-600" items={databases} />
        </div>
      </section>

      {/* AI INSIGHT */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-brand-gradient p-7 text-white shadow-glow"
      >
        <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <h3 className="relative flex items-center gap-2 font-display text-lg font-bold">
          <FaWandMagicSparkles /> AI Recommendation Insight
        </h3>
        <p className="relative mt-3 leading-relaxed text-white/90">{insight}</p>
      </motion.section>

      {/* CAREER SUGGESTION / ROADMAP */}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-100 bg-white/80 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800">
            <FaRoad className="text-brand-500" /> Roadmap Belajar
          </h3>
          <p className="mt-1 text-sm text-slate-500">Skill yang sebaiknya kamu pelajari untuk {top.career}:</p>
          <ul className="mt-4 space-y-2.5">
            {meta.learn.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-sm text-slate-700">
                <FaCircleCheck className="shrink-0 text-emerald-500" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-slate-100 bg-white/80 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800">
            <FaLightbulb className="text-amber-500" /> Peluang Karir
          </h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-600">Estimasi Gaji</p>
              <p className="font-display text-xl font-bold text-emerald-700">{meta.salary}</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Permintaan untuk posisi <span className="font-semibold">{top.career}</span> terus meningkat di industri teknologi.
              Tingkatkan portofolio & sertifikasi relevan untuk mempercepat karirmu.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link to="/riwayat" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Lihat semua riwayat rekomendasi →
        </Link>
      </div>
    </div>
  );
}

function SkillGroup({ icon: Icon, title, color, items }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`}>
          <Icon className="text-xs" />
        </span>
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-sm text-slate-400">—</span>
        ) : (
          items.map((it) => (
            <span key={it} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
              {it}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
