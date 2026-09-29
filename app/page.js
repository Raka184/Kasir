import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export default function Home() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;

  redirect(user ? "/dashboard" : "/login");
}
