import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaMagnifyingGlass, FaTrashCan, FaEye, FaClockRotateLeft, FaArrowTrendUp, FaInbox,
} from "react-icons/fa6";
import { listHistory, deleteHistory } from "../api/client.js";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getCareerMeta } from "../data/careerMeta.js";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const { setResult } = useApp();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listHistory({ limit: 50, search, sort: sort === "score" ? "score" : "recent" });
      setItems(res.data || []);
      setTotal(res.meta?.total || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load, isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      toast.success("Riwayat dihapus.");
      load();
    } catch {
      toast.error("Gagal menghapus riwayat.");
    }
  };

  const handleView = (item) => {
    setResult(item);
    navigate("/hasil");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Riwayat Rekomendasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isAuthenticated ? `Riwayat pribadi ${user?.name?.split(" ")[0]}` : "Riwayat sesi tamu (login untuk menyimpan permanen)"} · {total} entri
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5">
          <FaMagnifyingGlass className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari karir..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <select
          value={sort} onChange={(e) => setSort(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-600 outline-none"
        >
          <option value="recent">Terbaru</option>
          <option value="score">Skor tertinggi</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-20 rounded-3xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/60 py-16 text-center">
          <FaInbox className="mx-auto text-4xl text-slate-300" />
          <p className="mt-3 font-medium text-slate-500">Belum ada riwayat</p>
          <button onClick={() => navigate("/input")} className="btn-gradient mt-5 !py-2.5 text-sm">Buat Rekomendasi</button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((it, i) => {
              const meta = getCareerMeta(it.top_career);
              const Icon = meta.icon;
              const score = it.top_score != null ? Math.round(Number(it.top_score) * 100) : 0;
              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-white/80 p-4 transition-all hover:shadow-card"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-white`}>
                    <Icon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{it.top_career || "—"}</p>
                    <p className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><FaClockRotateLeft /> {new Date(it.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </p>
                  </div>
                  <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 sm:flex">
                    <FaArrowTrendUp /> {score}%
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleView(it)} title="Lihat detail"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-600 hover:bg-brand-50">
                      <FaEye />
                    </button>
                    <button onClick={() => handleDelete(it.id)} title="Hapus"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 hover:bg-red-50">
                      <FaTrashCan />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
