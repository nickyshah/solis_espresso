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
    { size: "", price: 0 },
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
      sizes: isFoodItem ? [{ size: "", price: 0 }] : [{ size: "Small", price: 0 }, { size: "Large", price: 0 }]
    };
    setForm(newForm);
  }

  const isFoodCategory = ["pastries", "sandwiches", "desserts"].includes(form.category);

  async function submit() {
    setLoading(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      await refresh();
      setForm(isFoodCategory ? emptyFood : empty);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function editItem(item: Item) {
    setForm({
      ...item,
      milkOptions: item.milkOptions || [],
      hasSizes: item.sizes.length > 1 || (item.sizes.length === 1 && item.sizes[0].size !== "Single")
    });
    setEditingItem(item);
  }

  function cancelEdit() {
    setForm(empty);
    setEditingItem(null);
  }

  async function deleteItem(itemId: number) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      await refresh();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            {editingItem && (
              <button
                onClick={cancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel Edit
              </button>
            )}
          </div>
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
                  id="hasSizes"
                  type="checkbox"
                  checked={form.hasSizes}
                  onChange={(e) => setForm({ ...form, hasSizes: e.target.checked })}
                />
                <label htmlFor="hasSizes" className="text-sm text-navy">
                  Has Size Options
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

              {/* Dynamic Sizes */}
              {form.hasSizes ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-navy">Size Options</label>
                    <button
                      type="button"
                      onClick={addSize}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" />
                      Add Size
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Size name (e.g., Small, Large)"
                          value={size.size}
                          onChange={(e) => updateSize(index, 'size', e.target.value)}
                          className="flex-1 border rounded-md px-3 py-2"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={size.price}
                          onChange={(e) => updateSize(index, 'price', e.target.value)}
                          className="w-24 border rounded-md px-3 py-2"
                        />
                        {form.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={form.sizes[0]?.price || 0}
                    onChange={(e) => updateSize(0, 'price', e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              )}

              {/* Dynamic Milk Options */}
              {form.hasMilk && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-navy">Milk Options</label>
                    <button
                      type="button"
                      onClick={addMilkOption}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" />
                      Add Milk Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.milkOptions.map((milk, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Milk name (e.g., Oat, Almond)"
                          value={milk.name}
                          onChange={(e) => updateMilkOption(index, 'name', e.target.value)}
                          className="flex-1 border rounded-md px-3 py-2"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Extra price"
                          value={milk.price}
                          onChange={(e) => updateMilkOption(index, 'price', e.target.value)}
                          className="w-24 border rounded-md px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeMilkOption(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={submit}
                disabled={loading || !form.name || !form.category}
                className="inline-flex items-center justify-center px-5 py-3 rounded-md solis-gradient text-white font-semibold hover:opacity-90 w-full"
              >
                {loading ? "Saving..." : editingItem ? "Update Item" : "Save Item"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl p-6 warm-shadow">
          <h2 className="text-lg font-bold text-navy mb-4">Current Items</h2>
          <div className="space-y-3">
            {items.map((it) => {
              return (
                <div key={it.id} className="border rounded-md p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-navy">{it.name}</div>
                      <div className="text-navy-light text-sm capitalize">{it.category.replace('_', ' ')}</div>
                      {it.description && (
                        <div className="text-gray-600 text-sm mt-1">{it.description}</div>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        {it.hasMilk && <span>Has Milk Options</span>}
                        {it.sizes.length > 1 && <span>Multiple Sizes</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      {/* Price section */}
                      <div className="text-sm text-navy min-w-0">
                        <div className="text-right">
                          {it.sizes.map((size, idx) => (
                            <div key={idx} className="mb-1 whitespace-nowrap">
                              {size.size && <span className="font-medium">{size.size} </span>}
                              <span className="font-semibold">${size.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {it.milkOptions && it.milkOptions.length > 0 && (
                          <div className="text-xs text-gray-500 mt-2 text-right">
                            <div className="font-medium mb-1">Milk Options:</div>
                            {it.milkOptions.map((m, idx) => (
                              <div key={idx}>{m.name} (+${m.price.toFixed(2)})</div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex flex-col gap-1 ml-2">
                        <button
                          onClick={() => toggleFeatured(it.id!, it.isFeatured)}
                          className="p-2 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                          title={it.isFeatured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              it.isFeatured
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => editItem(it)}
                          className="p-2 rounded-md hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-800 border border-blue-200"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(it.id!)}
                          className="p-2 rounded-md hover:bg-red-50 transition-colors text-red-600 hover:text-red-800 border border-red-200"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
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
