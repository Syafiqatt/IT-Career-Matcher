import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaAt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return setErr("Semua field wajib diisi.");
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username))
      return setErr("Username 3-30 karakter, hanya huruf, angka, dan garis bawah.");
    if (password.length < 6) return setErr("Password minimal 6 karakter.");
    if (password !== confirm) return setErr("Konfirmasi password tidak cocok.");
    setErr("");
    setLoading(true);
    try {
      const user = await register(name, username, email, password);
      toast.success(`Akun dibuat. Halo, ${user.name.split(" ")[0]}!`);
      navigate("/input");
    } catch (e) {
      setErr(e.response?.data?.message || e.response?.data?.errors?.join(", ") || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Buat Akun Baru"
      subtitle="Daftar gratis untuk menyimpan riwayat rekomendasimu."
      footer={<>Sudah punya akun? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Masuk di sini</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={FaUser} type="text" placeholder="Nama lengkap" value={name} onChange={setName} />
        <Field icon={FaAt} type="text" placeholder="Username" value={username} onChange={setUsername} />
        <Field icon={FaEnvelope} type="email" placeholder="Email" value={email} onChange={setEmail} />
        <div className="relative">
          <Field icon={FaLock} type={show ? "text" : "password"} placeholder="Password (min. 6 karakter)" value={password} onChange={setPassword} />
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Field icon={FaLock} type={show ? "text" : "password"} placeholder="Konfirmasi password" value={confirm} onChange={setConfirm} />

        {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}

        <button type="submit" disabled={loading} className="btn-gradient group w-full">
          {loading ? "Memproses..." : "Daftar Sekarang"}
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
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="input-base pl-11" />
    </div>
  );
}
