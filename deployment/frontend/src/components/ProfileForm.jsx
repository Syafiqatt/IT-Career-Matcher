import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCode, FaScrewdriverWrench, FaDatabase, FaClock, FaGraduationCap,
  FaListOl, FaArrowRight,
} from "react-icons/fa6";
import MultiSelect from "./MultiSelect.jsx";

const EDU_OPTIONS = [
  { value: 0, label: "Tanpa pendidikan formal" },
  { value: 1, label: "SMA / sederajat" },
  { value: 2, label: "Sarjana (S1)" },
  { value: 3, label: "Magister (S2)" },
  { value: 6, label: "Doktor (S3) / lainnya" },
];

export default function ProfileForm({ options, onSubmit, loading }) {
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [yearsCode, setYearsCode] = useState(0);
  const [educationLevel, setEducationLevel] = useState("");
  const [topN, setTopN] = useState(3);
  const [err, setErr] = useState("");

  // Indikator kelengkapan (5 aspek inti).
  const progress = useMemo(() => {
    let done = 0;
    if (skills.length) done++;
    if (tools.length) done++;
    if (databases.length) done++;
    if (yearsCode > 0) done++;
    if (educationLevel !== "") done++;
    return Math.round((done / 5) * 100);
  }, [skills, tools, databases, yearsCode, educationLevel]);

  const submit = (e) => {
    e.preventDefault();
    if (skills.length === 0) return setErr("Pilih minimal satu skill terlebih dahulu.");
    if (educationLevel === "") return setErr("Pilih tingkat pendidikan Anda.");
    setErr("");
    onSubmit({
      skills, tools, databases,
      years_code: Number(yearsCode),
      education_level: Number(educationLevel),
      top_n: Number(topN),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Progress indicator */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Kelengkapan profil</span>
          <span className="text-brand-600">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <MultiSelect label="Skill / Bahasa Pemrograman" icon={FaCode} options={options.skills || []}
        value={skills} onChange={setSkills} placeholder="Pilih skill yang Anda kuasai..." />
      <MultiSelect label="Tools / IDE" icon={FaScrewdriverWrench} options={options.tools || []}
        value={tools} onChange={setTools} placeholder="Pilih tools..." hint="opsional" />
      <MultiSelect label="Database" icon={FaDatabase} options={options.databases || []}
        value={databases} onChange={setDatabases} placeholder="Pilih database..." hint="opsional" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-600"><FaClock className="text-xs" /></span>
            Pengalaman coding
            <span className="ml-auto rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">{yearsCode} thn</span>
          </label>
          <input type="range" min="0" max="30" value={yearsCode}
            onChange={(e) => setYearsCode(e.target.value)}
            className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-600"><FaGraduationCap className="text-xs" /></span>
            Tingkat pendidikan
          </label>
          <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="input-base bg-white">
            <option value="" disabled>— Pilih tingkat pendidikan —</option>
            {EDU_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-600"><FaListOl className="text-xs" /></span>
          Jumlah rekomendasi (Top-N)
          <span className="ml-auto rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">{topN}</span>
        </label>
        <input type="range" min="1" max="10" value={topN}
          onChange={(e) => setTopN(e.target.value)} className="w-full accent-brand-600" />
      </div>

      {err && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{err}</motion.p>
      )}

      <button type="submit" disabled={loading} className="btn-gradient group w-full">
        {loading ? "Memproses..." : "Lihat Rekomendasi Karir"}
        {!loading && <FaArrowRight className="transition-transform group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
