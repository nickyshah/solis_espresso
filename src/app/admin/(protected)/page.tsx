"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Size = { id?: number; size: "small" | "large"; price: number };
type Item = {
  id?: number;
  name: string;
  description?: string;
  category: "coffee" | "espresso" | "tea" | "pastries" | "sandwiches" | "desserts";
  isFeatured: boolean;
  ingredients?: string[];
  sizes: Size[];
};

const empty: Item = {
  name: "",
  description: "",
  category: "coffee",
  isFeatured: false,
  ingredients: [],
  sizes: [
    { size: "small", price: 0 },
    { size: "large", price: 0 },
  ],
};

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const data = await fetch("/api/menu", { cache: "no-store" }).then((r) => r.json());
    setItems(data || []);
  }

  function setPrice(size: "small" | "large", value: string) {
    const num = Number(value || 0);
    setForm((f) => {
      const next = { ...f };
      const idx = next.sizes.findIndex((s) => s.size === size);
      if (idx >= 0) next.sizes[idx] = { ...next.sizes[idx], price: isNaN(num) ? 0 : num };
      else next.sizes.push({ size, price: isNaN(num) ? 0 : num });
      return next;
    });
  }

  async function submit() {
    setLoading(true);
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
      })
      .then(refresh)
      .finally(() => {
        setForm(empty);
        setLoading(false);
      });
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-navy mb-8"
      >
        Admin — Menu
      </motion.h1>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-xl p-6 warm-shadow">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Latte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                rows={3}
                placeholder="Smooth, balanced milk coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Item["category"] })
                }
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="coffee">Coffee</option>
                <option value="espresso">Espresso</option>
                <option value="tea">Tea</option>
                <option value="pastries">Pastries</option>
                <option value="sandwiches">Sandwiches</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              <label htmlFor="featured" className="text-sm text-navy">
                Featured
              </label>
            </div>

            {/* Sizes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Small price</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.sizes.find((s) => s.size === "small")?.price ?? 0}
                  onChange={(e) => setPrice("small", e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Large price</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.sizes.find((s) => s.size === "large")?.price ?? 0}
                  onChange={(e) => setPrice("large", e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading || !form.name || !form.category}
              className="inline-flex items-center justify-center px-5 py-3 rounded-md solis-gradient text-white font-semibold hover:opacity-90"
            >
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl p-6 warm-shadow">
          <h2 className="text-lg font-bold text-navy mb-4">Current Items</h2>
          <div className="space-y-3">
            {items.map((it) => {
              const small = it.sizes.find((s) => s.size === "small");
              const large = it.sizes.find((s) => s.size === "large");
              return (
                <div key={it.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-navy">{it.name}</div>
                      <div className="text-navy-light text-sm capitalize">{it.category}</div>
                    </div>
                    <div className="text-sm text-navy flex gap-3">
                      {small && <span>Small ${small.price.toFixed(2)}</span>}
                      {large && <span>Large ${large.price.toFixed(2)}</span>}
                    </div>
                  </div>
                  {it.description && (
                    <div className="text-gray-600 text-sm mt-2">{it.description}</div>
                  )}
                </div>
              );
            })}
            {!items.length && <div className="text-gray-500 text-sm">No items yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
