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
    <aside className="flex w-full shrink-0 flex-col bg-[linear-gradient(180deg,#7f1d1d_0%,#b91c1c_52%,#dc2626_100%)] text-white shadow-[0_12px_35px_rgba(127,29,29,0.14)] md:min-h-screen md:w-64">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6 md:py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-lg shadow-black/10">
          <Store size={20} />
        </div>
        <div>
          <span className="block text-lg font-extrabold leading-none tracking-tight">Clashmart</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.20em] text-emerald-100/70">
            Sistem Kasir
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
                  ? "bg-white text-brand-700 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                  : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-red-50 text-brand-700" : "bg-white/10 group-hover:bg-white/15"}`}>
                <Icon size={17} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 md:block md:py-4">
        <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2.5 md:mb-3">
          <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
          <p className="mt-1 text-xs text-slate-300 flex items-center gap-1.5">
            {isAdmin ? <ShieldCheck size={12} /> : <UserRound size={12} />}
            {isAdmin ? "Admin" : "Petugas"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-red-100/90 transition hover:bg-white/10 hover:text-white md:w-full md:gap-3"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
