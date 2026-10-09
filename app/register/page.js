"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.13),transparent_32%),linear-gradient(135deg,#ffffff_0%,#fffafa_55%,#fff1f2_100%)] px-4 py-10">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute left-10 top-10 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_30px_80px_rgba(18,60,42,0.15)] md:grid-cols-[1fr_1.2fr]">
        <div className="hidden flex-col justify-between bg-[linear-gradient(145deg,#7f1d1d_0%,#dc2626_65%,#fff1f2_100%)] p-10 text-white md:flex">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Store size={16} className="text-white" />
              Clashmart · Sistem Kasir
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight tracking-tight">Buat akun baru, mulai transaksi lebih cerdas.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-red-50/90">
              Daftar sekarang dan nikmati pengalaman kasir yang lebih cepat, rapi, dan siap untuk bisnis Anda berkembang.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-red-50 shadow-xl shadow-black/10">
            <p className="font-semibold text-white">Catatan penting</p>
            <p className="mt-2 leading-relaxed">
              Pendaftar pertama otomatis menjadi <b>Admin</b>. Pendaftaran berikutnya menjadi <b>Petugas</b>.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="mb-7 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-[0_16px_35px_rgba(220,38,38,0.25)]">
              <Store size={28} />
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">Buat Akun</h1>
            <p className="mt-1 text-sm text-gray-500">Daftar untuk mulai menggunakan kasir</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              <CheckCircle2 size={16} /> Akun berhasil dibuat, mengalihkan ke login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Masukan Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Masukan Username"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl hover:brightness-110 disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Daftar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
