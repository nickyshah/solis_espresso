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
        // Safely extract and type the credentials
        const { email, password } = (creds ?? {}) as {
          email?: string;
          password?: string;
        };

        const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
        const adminPass = process.env.ADMIN_PASSWORD ?? "";

        const isMatch =
          (email ?? "").toLowerCase() === adminEmail &&
          (password ?? "") === adminPass;

        if (!isMatch) return null;

        // Return the actual user email (not the env value), tagged as admin
        return {
          id: "admin-1",
          name: "Admin",
          email: email ?? adminEmail,
          role: "admin" as const,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role ?? "user";
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = (token as any).role ?? "user";
      return session;
    },
  },
});
