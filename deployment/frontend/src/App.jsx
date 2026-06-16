import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import HomePage from "./pages/HomePage.jsx";
import InputPage from "./pages/InputPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Rute yang hanya bisa diakses setelah login. Guest diarahkan ke halaman login. */
function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashLeaving(true), 2000); // mulai fade-out (CSS)
    const t2 = setTimeout(() => setShowSplash(false), 2600); // unmount setelah fade
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen leaving={splashLeaving} />}

      {/* Background dekoratif global */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-brand-50/40" />
      </div>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><HomePage /></Page>} />
            <Route path="/input" element={<ProtectedRoute><Page><InputPage /></Page></ProtectedRoute>} />
            <Route path="/hasil" element={<ProtectedRoute><Page><ResultPage /></Page></ProtectedRoute>} />
            <Route path="/riwayat" element={<ProtectedRoute><Page><HistoryPage /></Page></ProtectedRoute>} />
            <Route path="/login" element={<Page><LoginPage /></Page>} />
            <Route path="/register" element={<Page><RegisterPage /></Page>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
