import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import Sidebar from "./sidebar";

export default function DashboardLayout({ children }) {
  const token = cookies().get(COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),transparent_35%),linear-gradient(135deg,#0b0b0b_0%,#171111_35%,#2b1a1a_100%)]">
      <Sidebar user={user} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
