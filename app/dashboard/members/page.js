"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

const emptyForm = { name: "", phone: "", address: "" };

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data.members || []);
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

  function openEdit(m) {
    setForm({ name: m.name, phone: m.phone || "", address: m.address || "" });
    setEditingId(m.id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = editingId ? `/api/members/${editingId}` : "/api/members";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan member.");
        setSaving(false);
        return;
      }
      setShowForm(false);
      loadMembers();
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus member ini?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    loadMembers();
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Member</h1>
          <p className="text-gray-500 text-sm">Registrasi & kelola data pelanggan.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus size={18} /> Registrasi Member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Telepon</th>
              <th className="px-5 py-3 font-medium">Alamat</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                  Memuat...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                  <Users className="mx-auto mb-2" size={28} />
                  Belum ada member terdaftar.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3 font-medium text-gray-800">{m.name}</td>
                  <td className="px-5 py-3 text-gray-500">{m.phone || "-"}</td>
                  <td className="px-5 py-3 text-gray-500">{m.address || "-"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              {editingId ? "Edit Member" : "Registrasi Member"}
            </h3>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nama</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">No. Telepon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Opsional"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Alamat</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Opsional"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-60 mt-2"
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
