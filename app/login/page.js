"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.13),transparent_32%),linear-gradient(135deg,#ffffff_0%,#fffafa_55%,#fff1f2_100%)] px-4 py-10">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-8 right-10 h-52 w-52 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_30px_80px_rgba(18,60,42,0.15)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-[linear-gradient(145deg,#7f1d1d_0%,#dc2626_65%,#fff1f2_100%)] p-10 text-white md:flex">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Store size={16} className="text-white" />
              Clashmart · Sistem Kasir
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight tracking-tight">Kelola transaksi dengan lebih cepat.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-red-50/90">
              Kelola produk, layani pelanggan, dan selesaikan transaksi harian dengan lebih praktis.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-red-50">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
              <div className="text-xl font-bold text-white">24/7</div>
              <div>Transaksi</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
              <div className="text-xl font-bold text-white">99%</div>
              <div>Akurat</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
              <div className="text-xl font-bold text-white">Fast</div>
              <div>Checkout</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-[0_16px_35px_rgba(220,38,38,0.25)]">
              <Store size={28} />
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">Selamat Datang</h1>
            <p className="mt-1 text-sm text-gray-500">Masuk ke akun kasir Anda</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Masukan Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Masukan Username"
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 hover:shadow-xl disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Masuk
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
              Lupa password?
            </Link>
            <p className="text-gray-500">
              Baru di sini?{" "}
              <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
