"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Store, Lock, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token reset tidak valid atau sudah kedaluwarsa.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengubah password.");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Password berhasil diubah.");
      setLoading(false);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.13),transparent_32%),linear-gradient(135deg,#ffffff_0%,#fffafa_55%,#fff1f2_100%)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white bg-white p-8 shadow-[0_24px_60px_rgba(127,29,29,0.12)]">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
            <Store className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Buat Password Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Silakan masukkan password baru Anda</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Password Baru</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Ulangi password baru"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Simpan Password Baru
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">Memuat...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
