import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOptions, createRecommendation } from "../api/client.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [options, setOptions] = useState({ skills: [], tools: [], databases: [] });
  const [optionsError, setOptionsError] = useState(null);
  const [result, setResult] = useState(null); // hasil rekomendasi yang sedang ditampilkan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch(() =>
        setOptionsError("Gagal memuat opsi. Pastikan backend & ML service berjalan.")
      );
  }, []);

  // Jalankan rekomendasi: set loading, panggil API, simpan hasil. Dikelola di context
  // agar tetap berjalan walau halaman form sudah ditinggalkan.
  const runRecommendation = async (profile) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const startedAt = Date.now();
    try {
      const data = await createRecommendation(profile);
      const elapsed = Date.now() - startedAt;
      if (elapsed < 600) await new Promise((r) => setTimeout(r, 600 - elapsed));
      setResult(data);
      toast.success("Rekomendasi berhasil dibuat!");
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.errors?.join(", ") ||
        "Gagal mendapatkan rekomendasi. Coba lagi.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ options, optionsError, result, setResult, loading, error, runRecommendation }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
