"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

const emptyForm = { name: "", category: "", price: "", stock: "", image: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      category: p.category || "",
      price: p.price,
      stock: p.stock,
      image: p.image || "",
    });
    setEditingId(p.id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan produk.");
        setSaving(false);
        return;
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const productCount = products.length;
  const lowStock = products.filter((p) => Number(p.stock || 0) <= 5).length;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,#121212_0%,#2a1717_35%,#991b1b_100%)] p-6 text-white shadow-[0_20px_50px_rgba(127,29,29,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-100/80">Dashboard Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Produk</h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Produk</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{productCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Stok Keseluruhan</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalStock}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Stok Rendah</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{lowStock}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Produk</th>
                <th className="px-5 py-4 font-semibold">Kategori</th>
                <th className="px-5 py-4 font-semibold">Harga</th>
                <th className="px-5 py-4 font-semibold">Stok</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Memuat...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    <Package className="mx-auto mb-2" size={28} />
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">#{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.category || "-"}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{formatRupiah(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${Number(p.stock || 0) <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h3 className="mb-5 text-xl font-bold text-slate-800">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </h3>

            {error && (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Nama Produk</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Kategori</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Opsional"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Harga</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Stok</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">URL Gambar</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Opsional"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
