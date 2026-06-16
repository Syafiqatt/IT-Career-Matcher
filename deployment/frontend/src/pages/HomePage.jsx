import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight, FaBrain, FaBolt, FaChartPie,
  FaUserShield, FaGaugeHigh, FaCircleCheck, FaRightToBracket,
} from "react-icons/fa6";
import AnimatedNumber from "../components/AnimatedNumber.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const PREVIEW = [
  { role: "Frontend Developer", score: 89, color: "from-pink-500 to-rose-500" },
  { role: "Backend Developer", score: 82, color: "from-emerald-500 to-teal-500" },
  { role: "Data Analyst", score: 78, color: "from-indigo-500 to-blue-500" },
];

const FEATURES = [
  { icon: FaBrain, title: "Machine Learning", desc: "Model Random Forest dilatih pada 139K+ data developer nyata untuk akurasi tinggi." },
  { icon: FaBolt, title: "Hasil Instan", desc: "Dapatkan rekomendasi Top-N karir lengkap dengan skor kecocokan dalam hitungan detik." },
  { icon: FaChartPie, title: "Analisis Skill", desc: "Visualisasi skill kamu dikelompokkan dan dianalisis untuk insight yang jelas." },
  { icon: FaUserShield, title: "Riwayat Pribadi", desc: "Login untuk menyimpan & mengelola seluruh riwayat rekomendasimu dengan aman." },
];

const STEPS = [
  { n: "01", title: "Isi Profil Skill", desc: "Masukkan skill, tools, database, pengalaman, dan pendidikanmu." },
  { n: "02", title: "AI Menganalisis", desc: "Model machine learning memproses profil dan menghitung kecocokan." },
  { n: "03", title: "Lihat Rekomendasi", desc: "Terima Top-N karir terbaik beserta insight dan roadmap belajar." },
];

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay: d },
});

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const startTo = isAuthenticated ? "/input" : "/login";

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* ===== HERO ===== */}
      <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Temukan Jalur Karir IT <span className="text-gradient">Terbaikmu</span> dengan AI
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            IT Career Matcher membantu merekomendasikan profesi IT terbaik berdasarkan skill, tools,
            pengalaman, dan minat menggunakan machine learning.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={startTo} className="btn-gradient group">
              {isAuthenticated ? "Mulai Analisis" : "Mulai Sekarang"}
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn-ghost">
                <FaRightToBracket /> Login
              </Link>
            )}
          </div>
          {!isAuthenticated && (
            <p className="mt-3 text-sm text-slate-500">
              Login terlebih dahulu untuk mulai menganalisis karirmu.
            </p>
          )}
          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><FaCircleCheck className="text-emerald-500" /> 18 jalur karir</span>
            <span className="flex items-center gap-2"><FaCircleCheck className="text-emerald-500" /> Akurasi 97%</span>
          </div>
        </motion.div>

        {/* Floating preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-300/40 to-accent-300/40 blur-2xl" />
          <div className="animate-float-slow glass rounded-3xl p-6 shadow-glow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><FaGaugeHigh /></span>
                <p className="font-semibold text-slate-800">Hasil Rekomendasi</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Best Match</span>
            </div>
            <div className="space-y-3">
              {PREVIEW.map((p, i) => (
                <motion.div
                  key={p.role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="rounded-2xl border border-slate-100 bg-white/70 p-3"
                >
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{p.role}</span>
                    <span className="font-bold text-slate-800">{p.score}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.score}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <motion.section {...fade()} className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-100 bg-white/70 p-6 backdrop-blur md:grid-cols-4">
        {[
          { v: 18, suffix: "", label: "Jalur Karir IT" },
          { v: 139, suffix: "K+", label: "Data Pelatihan" },
          { v: 97, suffix: "%", label: "Akurasi Model" },
          { v: 3, suffix: "", label: "Model Dibandingkan" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-extrabold text-gradient sm:text-4xl">
              <AnimatedNumber value={s.v} />{s.suffix}
            </p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </motion.section>

      {/* ===== FEATURES ===== */}
      <section className="py-16">
        <motion.div {...fade()} className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Kenapa IT Career Matcher?</h2>
          <p className="mt-3 text-slate-600">Platform rekomendasi karir modern yang dirancang untuk membantumu mengambil keputusan dengan percaya diri.</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fade(i * 0.08)}
              className="group rounded-3xl border border-slate-100 bg-white/80 p-6 transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow transition-transform group-hover:scale-110">
                <f.icon className="text-xl" />
              </span>
              <h3 className="font-display text-lg font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="pb-16">
        <motion.div {...fade()} className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Cara Kerjanya</h2>
          <p className="mt-3 text-slate-600">Tiga langkah sederhana menuju rekomendasi karir IT-mu.</p>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} {...fade(i * 0.1)} className="relative rounded-3xl border border-slate-100 bg-white/80 p-7">
              <span className="font-display text-5xl font-extrabold text-brand-100">{s.n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <motion.section {...fade()} className="relative mb-8 overflow-hidden rounded-[2rem] bg-brand-gradient p-10 text-center text-white shadow-glow-lg sm:p-14">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-accent-400/30 blur-3xl animate-blob" />
        <h2 className="relative font-display text-3xl font-bold sm:text-4xl">Siap menemukan karir impianmu?</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-white/80">Mulai analisis sekarang — gratis dan hanya butuh beberapa detik.</p>
        <Link to={startTo} className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-semibold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
          {isAuthenticated ? "Mulai Sekarang" : "Login untuk Mulai"} <FaArrowRight />
        </Link>
      </motion.section>
    </div>
  );
}
