"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  History,
  LogOut,
  Store,
  Users,
  UserCog,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const baseLinks = [
  { href: "/dashboard", label: "Kasir", icon: ShoppingCart },
  { href: "/dashboard/members", label: "Member", icon: Users },
  { href: "/dashboard/history", label: "Laporan", icon: History },
];

const adminLinks = [
  { href: "/dashboard/products", label: "Produk", icon: Package },
  { href: "/dashboard/users", label: "Pengguna", icon: UserCog },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  // Admin: Produk, Member, Pengguna, Laporan
  // Petugas: Kasir, Member, Laporan
  const links = isAdmin
    ? [adminLinks[0], baseLinks[1], adminLinks[1], baseLinks[2]]
    : baseLinks;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#111111_0%,#1b1111_26%,#4a1717_100%)] text-white flex flex-col md:w-64 md:min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 md:py-5 border-b border-white/10">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-black flex items-center justify-center shadow-[0_12px_24px_rgba(239,68,68,0.35)]">
          <Store size={20} />
        </div>
        <div>
          <span className="block text-lg font-bold leading-none">Cashier Website</span>
          <span className="block text-[10px] uppercase tracking-[0.20em] text-slate-300 mt-1">
            Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:block md:flex-1 md:space-y-1.5 md:overflow-visible md:py-5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex shrink-0 items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 md:gap-3 md:px-3.5 md:py-2.5 md:rounded-2xl ${
                active
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_12px_28px_rgba(239,68,68,0.25)]"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-white/15" : "bg-white/5 group-hover:bg-white/10"}`}>
                <Icon size={17} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 md:block md:py-4">
        <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 shadow-inner shadow-black/10 md:mb-3">
          <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
          <p className="mt-1 text-xs text-slate-300 flex items-center gap-1.5">
            {isAdmin ? <ShieldCheck size={12} /> : <UserRound size={12} />}
            {isAdmin ? "Admin" : "Petugas"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-medium text-red-200 hover:bg-red-500/10 transition md:w-full md:gap-3"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
