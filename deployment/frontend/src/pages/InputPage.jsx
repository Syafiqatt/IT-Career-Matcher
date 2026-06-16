import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWandMagicSparkles, FaLightbulb, FaCircleInfo, FaLock } from "react-icons/fa6";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileForm from "../components/ProfileForm.jsx";

export default function InputPage() {
  const { options, optionsError, runRecommendation } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (profile) => {
    runRecommendation(profile);
    navigate("/hasil");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          <FaWandMagicSparkles className="text-accent-500" /> Analisis Karir
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">Isi Profil Keahlianmu</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Semakin lengkap profil yang kamu isi, semakin akurat rekomendasi karir yang dihasilkan.
        </p>
      </motion.div>

      {optionsError && (
        <div className="mx-auto mb-5 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {optionsError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-[1.75rem] p-6 sm:p-8 lg:col-span-2"
        >
          <ProfileForm options={options} onSubmit={handleSubmit} />
        </motion.div>

        {/* Sidebar tips */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-[1.75rem] border border-slate-100 bg-white/80 p-6">
            <h3 className="flex items-center gap-2 font-display font-semibold text-slate-800">
              <FaLightbulb className="text-amber-500" /> Tips Pengisian
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><FaCircleInfo className="mt-0.5 shrink-0 text-brand-400" /> Pilih semua skill yang benar-benar kamu kuasai.</li>
              <li className="flex gap-2"><FaCircleInfo className="mt-0.5 shrink-0 text-brand-400" /> Tools & database bersifat opsional namun meningkatkan akurasi.</li>
              <li className="flex gap-2"><FaCircleInfo className="mt-0.5 shrink-0 text-brand-400" /> Atur Top-N untuk melihat lebih banyak alternatif karir.</li>
            </ul>
          </div>

          <div className={`rounded-[1.75rem] p-6 ${isAuthenticated ? "bg-emerald-50 border border-emerald-100" : "bg-brand-gradient text-white shadow-glow"}`}>
            {isAuthenticated ? (
              <p className="text-sm text-emerald-800">✓ Hasil rekomendasimu akan otomatis tersimpan di riwayat akunmu.</p>
            ) : (
              <>
                <h3 className="flex items-center gap-2 font-display font-semibold"><FaLock /> Simpan Riwayatmu</h3>
                <p className="mt-2 text-sm text-white/85">Login untuk menyimpan & mengelola semua riwayat rekomendasi secara pribadi.</p>
              </>
            )}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
