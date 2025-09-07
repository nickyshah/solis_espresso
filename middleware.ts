// middleware.ts (your patched version)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./src/lib/auth";

export const config = { matcher: ["/admin/:path*", "/api/menu/:path*"] };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const needsAdmin =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api/menu") && isWrite);

  if (!needsAdmin) return NextResponse.next();

  const session = await auth();
  const ok =
    !!session?.user?.email &&
    session.user.email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();

  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = req.nextUrl.clone();
  login.pathname = "/admin/login";
  return NextResponse.redirect(login);
}
