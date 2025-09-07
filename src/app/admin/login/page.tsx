'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) router.push("/admin");
    else setError("Invalid credentials");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-xl warm-shadow p-6">
        <h1 className="text-2xl font-bold text-navy mb-4">Admin Login</h1>
        <input className="w-full border rounded-md p-3 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-md p-3 mb-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button className="w-full px-4 py-3 rounded-lg gold-gradient text-navy font-semibold">Sign In</button>
      </form>
    </div>
  );
}
