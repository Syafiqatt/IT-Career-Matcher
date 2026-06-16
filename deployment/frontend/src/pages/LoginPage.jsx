import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return setErr("Username/email dan password wajib diisi.");
    setErr("");
    setLoading(true);
    try {
      const user = await login(identifier, password);
      toast.success(`Selamat datang, ${user.name.split(" ")[0]}!`);
      navigate("/input");
    } catch (e) {
      setErr(e.response?.data?.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Masuk ke Akun"
      subtitle="Selamat datang kembali! Silakan masuk untuk melanjutkan."
      footer={<>Belum punya akun? <Link to="/register" className="font-semibold text-brand-600 hover:underline">Daftar di sini</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={FaUser} type="text" placeholder="Username atau Email" value={identifier} onChange={setIdentifier} />
        <div className="relative">
          <Field icon={FaLock} type={show ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} />
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-brand-600" />
          Ingat saya
        </label>

        {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}

        <button type="submit" disabled={loading} className="btn-gradient group w-full">
          {loading ? "Memproses..." : "Masuk"}
          {!loading && <FaArrowRight className="transition-transform group-hover:translate-x-1" />}
        </button>
      </form>
    </AuthShell>
  );
}

function Field({ icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base pl-11"
      />
    </div>
  );
}
