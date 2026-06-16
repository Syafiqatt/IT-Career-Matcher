import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa6";

/** Splash screen modern: logo glowing + progress. Dismissal dikontrol via prop `leaving`
 *  (transisi CSS) agar andal tanpa bergantung pada penyelesaian animasi JS. */
export default function SplashScreen({ leaving = false }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden
        bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 transition-opacity duration-500
        ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-accent-400/30 blur-3xl animate-blob" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        className="relative"
      >
        <span className="absolute inset-0 rounded-3xl bg-white/40 animate-pulse-ring" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 shadow-glow-lg">
          <FaRocket className="text-4xl text-white drop-shadow" />
        </div>
      </motion.div>

      <h1 className="mt-7 font-display text-3xl font-bold tracking-tight text-white animate-fade-up">IT Career Matcher</h1>
      <p className="mt-1 text-sm text-white/70 animate-fade-up">Menyiapkan rekomendasi karir IT terbaik untukmu…</p>

      <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
