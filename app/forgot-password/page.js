"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Permintaan reset password gagal.");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Cek email Anda untuk link reset password.");
      setEmail("");
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Lupa Password</h1>
          <p className="text-gray-500 text-sm mt-1">Masukan email untuk reset password</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Masukan Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Masukan Email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Kirim Link Reset
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
