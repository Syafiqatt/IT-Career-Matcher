import { motion } from "framer-motion";

/** Shimmer skeleton saat menunggu hasil rekomendasi. */
export default function LoadingResult() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 text-slate-600">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="font-medium"
        >
          Menganalisis profil Anda & menghitung rekomendasi…
        </motion.p>
      </div>

      {/* Hero card skeleton */}
      <div className="glass rounded-[1.75rem] p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="skeleton h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="skeleton mx-auto h-4 w-24 rounded-full sm:mx-0" />
            <div className="skeleton mx-auto h-8 w-56 rounded-xl sm:mx-0" />
            <div className="skeleton mx-auto h-4 w-full max-w-md rounded-full sm:mx-0" />
          </div>
        </div>
      </div>

      {/* Ranking skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white/70 p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="skeleton h-11 w-11 rounded-2xl" />
              <div className="skeleton h-4 w-32 rounded-full" />
            </div>
            <div className="skeleton h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
