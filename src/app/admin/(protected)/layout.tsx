import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth();
  const email = (session?.user?.email || "").toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();

  if (!adminEmail || email !== adminEmail) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
