"use client";

import { useEffect, useState } from "react";
import { History, ChevronDown, ChevronUp } from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const PAYMENT_METHODS = [
  { value: "tunai", label: "Tunai" },
  { value: "dana", label: "Dana" },
  { value: "gopay", label: "GoPay" },
  { value: "ovo", label: "OVO" },
  { value: "shopeepay", label: "ShopeePay" },
  { value: "qris", label: "QRIS" },
];

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const paymentSummary = PAYMENT_METHODS.map((method) => {
    const methodTransactions = transactions.filter(
      (transaction) => transaction.paymentMethod === method.value
    );
    return {
      ...method,
      count: methodTransactions.length,
      total: methodTransactions.reduce(
        (sum, transaction) => sum + Number(transaction.total || 0),
        0
      ),
    };
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-sm">100 transaksi terbaru.</p>
      </div>

      {!loading && (
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-800">Ringkasan Pembayaran</h2>
            <p className="mt-1 text-xs text-gray-500">Berdasarkan 100 transaksi terbaru.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Metode</th>
                  <th className="px-5 py-3 text-right font-medium">Transaksi</th>
                  <th className="px-5 py-3 text-right font-medium">Total Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentSummary.map((method) => (
                  <tr key={method.value}>
                    <td className="px-5 py-3 font-medium text-gray-700">{method.label}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{method.count}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-800">
                      {formatRupiah(method.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="px-5 py-6 text-center text-gray-400">Memuat...</p>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400">
            <History className="mx-auto mb-2" size={28} />
            Belum ada transaksi.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((t) => {
              const isOpen = expanded === t.id;
              return (
                <div key={t.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : t.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 text-left"
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{t.invoiceNo}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(t.createdAt)} &middot; Kasir: {t.cashierName}
                        {t.member ? ` · Member: ${t.member.name}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800">
                        {formatRupiah(t.total)}
                      </span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 bg-gray-50/40">
                      <div className="text-sm space-y-1.5 border-t border-dashed border-gray-200 pt-3">
                        {t.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-gray-600">
                            <span>
                              {item.name} x{item.qty}
                            </span>
                            <span>{formatRupiah(item.subtotal)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-gray-500 pt-2 border-t border-dashed border-gray-200">
                          <span>Metode Bayar</span>
                          <span className="capitalize">{t.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Dibayar</span>
                          <span>{formatRupiah(t.paid)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Kembalian</span>
                          <span>{formatRupiah(t.change)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
