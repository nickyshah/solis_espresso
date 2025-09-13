// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
        const adminPass = process.env.ADMIN_PASSWORD || "";

        const emailOk = (typeof creds?.email === 'string' ? creds.email.toLowerCase() : "") === adminEmail;
        const passOk = (creds?.password || "") === adminPass;

        if (!emailOk || !passOk) return null;

        return {
          id: "admin-1",
          name: "Admin",
          email: adminEmail,
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "user";
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role || "user";
      return session;
    },
  },
});
