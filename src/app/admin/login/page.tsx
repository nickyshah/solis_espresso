"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) setErr("Invalid email or password");
    else router.push("/admin"); // ✅ correct
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream-light to-amber-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-navy mb-6">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full border rounded-md px-3 py-2" type="email"
                 value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
          <input className="w-full border rounded-md px-3 py-2" type="password"
                 value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
          {err && <p className="text-center text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
                  className="w-full bg-solis-gold text-navy font-semibold py-2 px-4 rounded-md hover:scale-105 transition-transform disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
