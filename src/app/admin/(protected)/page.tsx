"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Edit2, Trash2, Plus, X } from "lucide-react";

type Size = { id?: number; size: string; price: number };
type MilkOption = { id?: number; name: string; price: number };
type Item = {
  id?: number;
  name: string;
  description?: string;
  category: "coffee" | "cold-drinks" | "tea" | "pastries" | "sandwiches" | "desserts";
  isFeatured: boolean;
  hasMilk: boolean;
  hasSizes: boolean;
  ingredients?: string[];
  sizes: Size[];
  milkOptions: MilkOption[];
};

const empty: Item = {
  name: "",
  description: "",
  category: "coffee",
  isFeatured: false,
  hasMilk: false,
  hasSizes: true,
  ingredients: [],
  sizes: [
    { size: "Small", price: 0 },
    { size: "Large", price: 0 },
  ],
  milkOptions: [],
};

const emptyFood: Item = {
  name: "",
  description: "",
  category: "pastries",
  isFeatured: false,
  hasMilk: false,
  hasSizes: false,
  ingredients: [],
  sizes: [
    { size: "Single", price: 0 },
  ],
  milkOptions: [],
};

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const data = await fetch("/api/menu", { cache: "no-store" }).then((r) => r.json());
    setItems(data.items || []);
  }

  async function toggleFeatured(itemId: number, currentFeatured: boolean) {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }
      
      // Refresh the items list to show the updated status
      await refresh();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  }

  function addSize() {
    setForm(f => ({
      ...f,
      sizes: [...f.sizes, { size: "", price: 0 }]
    }));
  }

  function updateSize(index: number, field: 'size' | 'price', value: string | number) {
    setForm(f => {
      const newSizes = [...f.sizes];
      if (field === 'price') {
        newSizes[index] = { ...newSizes[index], price: Number(value) || 0 };
      } else {
        newSizes[index] = { ...newSizes[index], size: value as string };
      }
      return { ...f, sizes: newSizes };
    });
  }

  function removeSize(index: number) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.filter((_, i) => i !== index)
    }));
  }

  function addMilkOption() {
    setForm(f => ({
      ...f,
      milkOptions: [...f.milkOptions, { name: "", price: 0 }]
    }));
  }

  function updateMilkOption(index: number, field: 'name' | 'price', value: string | number) {
    setForm(f => {
      const newMilkOptions = [...f.milkOptions];
      if (field === 'price') {
        newMilkOptions[index] = { ...newMilkOptions[index], price: Number(value) || 0 };
      } else {
        newMilkOptions[index] = { ...newMilkOptions[index], name: value as string };
      }
      return { ...f, milkOptions: newMilkOptions };
    });
  }

  function removeMilkOption(index: number) {
    setForm(f => ({
      ...f,
      milkOptions: f.milkOptions.filter((_, i) => i !== index)
    }));
  }

  function onCategoryChange(category: Item["category"]) {
    const isFoodItem = ["pastries", "sandwiches", "desserts"].includes(category);
    const newForm = {
      ...form,
      category,
      hasSizes: !isFoodItem,
      sizes: isFoodItem ? [{ size: "Single", price: 0 }] : [{ size: "Small", price: 0 }, { size: "Large", price: 0 }]
    };
    setForm(newForm);
  }

  const isFoodCategory = ["pastries", "sandwiches", "desserts"].includes(form.category);

  async function submit() {
    setLoading(true);
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      await refresh();
      setForm(isFoodCategory ? emptyFood : empty);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
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

      <div className="space-y-8">
        {/* Form */}
        <div className="bg-white rounded-xl p-6 warm-shadow">
          <h2 className="text-lg font-bold text-navy mb-4">Add New Item</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                   onChange={(e) => onCategoryChange(e.target.value as Item["category"])}
                   className="w-full border rounded-md px-3 py-2"
                 >
                   <option value="coffee">Coffee</option>
                   <option value="cold-drinks">Cold Drinks</option>
                   <option value="tea">Tea</option>
                   <option value="pastries">Pastries</option>
                   <option value="sandwiches">Sandwiches</option>
                   <option value="desserts">Desserts</option>
                 </select>
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="flex items-center gap-2">
                <input
                  id="hasMilk"
                  type="checkbox"
                  checked={form.hasMilk}
                  onChange={(e) => setForm({ ...form, hasMilk: e.target.checked })}
                />
                <label htmlFor="hasMilk" className="text-sm text-navy">
                  Has Milk Options
                </label>
              </div>

              {/* Sizes */}
              {isFoodCategory ? (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.sizes.find((s) => s.size === "single")?.price ?? 0}
                    onChange={(e) => setPrice("single", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              ) : (
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
              )}

              <button
                onClick={submit}
                disabled={loading || !form.name || !form.category}
                className="inline-flex items-center justify-center px-5 py-3 rounded-md solis-gradient text-white font-semibold hover:opacity-90 w-full"
              >
                {loading ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl p-6 warm-shadow">
          <h2 className="text-lg font-bold text-navy mb-4">Current Items</h2>
          <div className="space-y-3">
            {items.map((it) => {
              const small = it.sizes.find((s) => s.size === "small");
              const large = it.sizes.find((s) => s.size === "large");
              const single = it.sizes.find((s) => s.size === "single");
              return (
                <div key={it.id} className="border rounded-md p-4 relative">
                  {/* Featured Star Icon */}
                  <button
                    onClick={() => toggleFeatured(it.id!, it.isFeatured)}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title={it.isFeatured ? "Remove from featured" : "Add to featured"}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        it.isFeatured
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    />
                  </button>
                  
                  <div className="flex items-center justify-between pr-8">
                    <div>
                      <div className="font-semibold text-navy">{it.name}</div>
                      <div className="text-navy-light text-sm capitalize">{it.category}</div>
                    </div>
                    <div className="text-sm text-navy flex gap-3">
                      {single && <span>${single.price.toFixed(2)}</span>}
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
