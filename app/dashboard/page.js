"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  X,
  Printer,
} from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

export default function KasirPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState([]); // {productId, name, price, qty, stock}
  const [paid, setPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tunai");
  const [memberId, setMemberId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);

  const paymentOptions = [
    { value: "tunai", label: "Tunai" },
    { value: "dana", label: "Dana" },
    { value: "gopay", label: "GoPay" },
    { value: "ovo", label: "OVO" },
    { value: "shopeepay", label: "ShopeePay" },
    { value: "qris", label: "QRIS" },
  ];

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok && data.user?.role === "admin") {
          router.replace("/dashboard/products");
          return;
        }
      } catch (err) {
        // ignore, halaman tetap bisa diakses oleh petugas
      }
    }

    checkAccess();
    loadProducts();
    loadMembers();
  }, [router]);

  async function loadMembers() {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      // biarkan kosong jika gagal, transaksi tetap bisa tanpa member
    }
  }

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

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["Semua", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Semua" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const qrisTax = paymentMethod === "qris" ? 1000 : 0;
  const amountDue = total + qrisTax;

  const qrisPaymentUrl = useMemo(() => {
    const amount = Math.max(amountDue, 0);
    return `kasir-app://pay?merchant=Kasir%20App&amount=${amount}`;
  }, [amountDue]);

  const change = useMemo(() => {
    const paidNum = paymentMethod === "qris" ? amountDue : parseInt(paid, 10) || 0;
    return paidNum - amountDue;
  }, [paid, paymentMethod, amountDue]);

  function addToCart(product) {
    setError("");
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      if (product.stock <= 0) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
        },
      ];
    });
  }

  function updateQty(productId, delta) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, qty: Math.min(i.stock, Math.max(1, i.qty + delta)) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    setPaid("");
    setMemberId("");
    setError("");
  }

  async function handleCheckout() {
    setError("");
    if (cart.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }
    const paidNum = paymentMethod === "qris" ? amountDue : parseInt(paid, 10) || 0;
    if (paidNum < amountDue) {
      setError("Uang dibayar kurang dari total belanja.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
          paid: paidNum,
          paymentMethod,
          memberId: memberId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Transaksi gagal.");
        setProcessing(false);
        return;
      }
      setReceipt(data.transaction);
      clearCart();
      loadProducts();
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa] lg:h-screen lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-6 lg:overflow-hidden">
        <div className="mb-5 overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#7f1d1d_0%,#dc2626_62%,#fff1f2_100%)] p-5 text-white shadow-[0_16px_36px_rgba(127,29,29,0.18)] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-100/90">Clashmart <span className="mx-1 text-white">•</span> Point of Sale</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Belanja nyaman, transaksi cepat.</h1>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-white/90 px-3 py-2 text-sm font-semibold text-brand-900">
              <ShoppingCart size={18} aria-hidden="true" />
              <span>{cart.length}</span>
              <span>Keranjang</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                category === c
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="min-h-[240px] flex-1 overflow-y-auto pr-1 lg:min-h-0">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400 shadow-sm">
              Memuat produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-400 shadow-sm">
              <ShoppingBag size={42} className="mb-3" />
              <p className="text-sm">Belum ada produk. Tambahkan lewat menu &quot;Produk&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.stock <= 0}
                  className="group rounded-[24px] border border-[#e5e9df] bg-white p-4 text-left shadow-[0_4px_14px_rgba(36,53,43,0.04)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_14px_30px_rgba(36,53,43,0.10)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-rose-100">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="text-brand-500" size={28} />
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="mt-2 text-lg font-bold text-brand-600">{formatRupiah(p.price)}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Stok</span>
                    <span className={p.stock > 0 ? "text-emerald-600" : "text-red-500"}>
                      {p.stock > 0 ? p.stock : "Habis"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-t border-[#e5e9df] bg-white p-4 shadow-[-8px_0_30px_rgba(36,53,43,0.04)] sm:p-5 lg:w-[420px] lg:shrink-0 lg:border-l lg:border-t-0">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <ShoppingBag size={18} className="text-brand-600" /> Keranjang
          </h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs font-semibold text-red-500 hover:text-red-600">
              Kosongkan
            </button>
          )}
        </div>

        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
              Belum ada item. Klik produk untuk menambahkan.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.productId, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-slate-700">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, 1)}
                    disabled={item.qty >= item.stock}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {paymentMethod === "qris" && (
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatRupiah(total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span>{paymentMethod === "qris" ? "Total + pajak" : "Total"}</span>
            <span className="text-xl font-black text-slate-900">{formatRupiah(amountDue)}</span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Member (opsional)
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="">Umum (tanpa member)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`rounded-xl border px-2 py-2 text-sm font-semibold transition ${
                    paymentMethod === option.value
                          ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === "qris" && (
            <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                  QRIS
                </span>
                <span className="text-xs font-medium text-violet-600">{formatRupiah(amountDue)}</span>
              </div>
              <div className="flex justify-center rounded-2xl bg-white p-3 shadow-inner shadow-violet-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrisPaymentUrl)}`}
                  alt="QRIS payment code"
                  className="h-40 w-40 rounded-xl object-contain"
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-violet-700">
                <span>Pajak QRIS</span>
                <span>{formatRupiah(qrisTax)}</span>
              </div>
              <p className="mt-3 text-center text-xs text-violet-700">
                Scan QRIS untuk membayar sesuai total termasuk pajak.
              </p>
            </div>
          )}

          {paymentMethod !== "qris" && <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Uang Dibayar
            </label>
            <input
              type="number"
              min={0}
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="0"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>}

          {paid && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-3 py-2 text-sm">
              <span className="text-emerald-700">Kembalian</span>
              <span className={change < 0 ? "font-semibold text-red-500" : "font-bold text-emerald-700"}>
                {formatRupiah(Math.max(change, 0))}
              </span>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={processing || cart.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-50"
          >
            <Receipt size={18} />
            {processing ? "Memproses..." : "Bayar"}
          </button>
        </div>
      </div>

      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-4">
          <Receipt className="mx-auto text-brand-600 mb-2" size={32} />
          <h3 className="font-bold text-lg text-gray-800">Transaksi Berhasil</h3>
          <p className="text-xs text-gray-400">{receipt.invoiceNo}</p>
          {receipt.member && (
            <p className="text-xs text-brand-600 mt-1">Member: {receipt.member.name}</p>
          )}
        </div>

        <div className="border-t border-dashed border-gray-200 pt-3 space-y-1.5 text-sm">
          {receipt.items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>
                {item.name} x{item.qty}
              </span>
              <span>{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-200 mt-3 pt-3 space-y-1 text-sm">
          {receipt.paymentMethod === "qris" && (
            <div className="flex justify-between text-gray-500">
              <span>Pajak QRIS</span>
              <span>{formatRupiah(1000)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatRupiah(receipt.total)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Dibayar</span>
            <span>{formatRupiah(receipt.paid)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Kembalian</span>
            <span>{formatRupiah(receipt.change)}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition"
        >
          <Printer size={16} /> Cetak Struk
        </button>
      </div>
    </div>
  );
}
