import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, isAdmin, COOKIE_NAME } from "@/lib/auth";

export default function UsersLayout({ children }) {
  const token = cookies().get(COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;

  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  return children;
}
