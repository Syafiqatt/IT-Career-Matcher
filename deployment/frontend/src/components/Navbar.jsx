import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaXmark,
  FaRightToBracket,
  FaUser,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const PUBLIC_NAV = [];
const PRIVATE_NAV = [
  { to: "/input", label: "Input Rekomendasi" },
  { to: "/hasil", label: "Hasil" },
  { to: "/riwayat", label: "Riwayat" },
];

function initials(name = "") {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "U";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const NAV = isAuthenticated ? PRIVATE_NAV : PUBLIC_NAV;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast.success("Berhasil logout.");
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-white/60 bg-white/75 backdrop-blur-xl shadow-card"
            : "border-transparent bg-white/40 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="IT Career Matcher" className="h-9 w-9 rounded-xl shadow-soft transition-transform group-hover:scale-105" />
            <span className="font-display text-lg font-bold tracking-tight text-slate-800">
              IT Career<span className="text-gradient"> Matcher</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="relative px-3 py-2">
                {({ isActive }) => (
                  <span className="relative text-sm font-medium">
                    <span className={isActive ? "text-brand-700" : "text-slate-600 hover:text-brand-600 transition-colors"}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-600 to-accent-600"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-1.5 pl-1.5 pr-3 transition-all hover:shadow-soft"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-xs font-bold text-white">
                    {initials(user?.name)}
                  </span>
                  <span className="max-w-[100px] truncate text-sm font-medium text-slate-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="truncate text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-50">
                        <FaUser className="text-slate-400" /> Profil
                      </button>
                      <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-50">
                        <FaGear className="text-slate-400" /> Pengaturan
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FaArrowRightFromBracket /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-1 px-3 pb-3">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-2.5 text-sm font-medium ${
                        isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="border-t border-slate-100 pt-2">
                  {!isAuthenticated ? (
                    <div className="flex gap-2">
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-sm font-semibold text-slate-700">
                        Login
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 py-2 text-center text-sm font-semibold text-white">
                        Register
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <FaArrowRightFromBracket /> Logout ({user?.name?.split(" ")[0]})
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
