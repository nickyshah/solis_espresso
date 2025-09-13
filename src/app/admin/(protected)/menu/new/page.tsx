// src/app/admin/(protected)/menu/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

type SizeRow = { id: string; size: string; price: string };

const CATEGORIES = [
  "coffee",
  "cold-drinks",
  "tea",
  "pastries",
  "sandwiches",
  "desserts",
] as const;

export default function NewMenuItemPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>("coffee");
  const [isFeatured, setIsFeatured] = React.useState(false);

  const [sizes, setSizes] = React.useState<SizeRow[]>([
    { id: crypto.randomUUID(), size: "Small", price: "" },
    { id: crypto.randomUUID(), size: "Large", price: "" },
  ]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function addSize() {
    setSizes((s) => [...s, { id: crypto.randomUUID(), size: "", price: "" }]);
  }
  function removeSize(id: string) {
    setSizes((s) => s.filter((r) => r.id !== id));
  }
  function updateSize(id: string, field: "size" | "price", value: string) {
    setSizes((s) => s.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        description: description || null,
        category,
        isFeatured,
        sizes: sizes
          .filter((r) => r.size.trim() && r.price.trim())
          .map((r) => ({ size: r.size.trim(), price: Number(r.price) })),
      };

      if (payload.sizes.length === 0) {
        setSaving(false);
        setError("Please add at least one size with a price.");
        return;
      }

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create item");
      }

      router.push("/admin"); // back to dashboard or admin list
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-navy mb-6">New Menu Item</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Name</label>
          <input
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-solis-gold outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Latte"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-solis-gold outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Smooth espresso with silky milk…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Category</label>
          <select
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-solis-gold outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="feat"
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label htmlFor="feat" className="text-sm text-navy">
            Featured
          </label>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-navy">Sizes</label>
            <button
              type="button"
              onClick={addSize}
              className="text-sm text-solis-gold hover:underline"
            >
              + Add size
            </button>
          </div>

          <div className="space-y-2">
            {sizes.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-2">
                <input
                  className="col-span-6 border rounded-md px-3 py-2 focus:ring-2 focus:ring-solis-gold outline-none"
                  placeholder="Small"
                  value={row.size}
                  onChange={(e) => updateSize(row.id, "size", e.target.value)}
                />
                <input
                  className="col-span-5 border rounded-md px-3 py-2 focus:ring-2 focus:ring-solis-gold outline-none"
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={row.price}
                  onChange={(e) => updateSize(row.id, "price", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSize(row.id)}
                  className="col-span-1 text-red-600"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="gold-gradient text-navy font-semibold px-6 py-2 rounded-md hover:scale-105 transition-transform disabled:opacity-60"
          >
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
