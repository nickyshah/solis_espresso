'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = {
  id?: number;
  name: string;
  description?: string;
  category: "coffee" | "espresso" | "tea" | "pastries" | "sandwiches" | "desserts";
  price: number;
  imageUrl?: string;
  isFeatured: boolean;
  ingredients?: string[];
};

const empty: Item = { name: "", description: "", category: "coffee", price: 0, imageUrl: "", isFeatured: false, ingredients: [] };

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  function load() { fetch("/api/menu").then(r=>r.json()).then(setItems); }
  useEffect(load, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/menu/${editingId}` : "/api/menu";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm(empty); setEditingId(null); load(); }
  }

  function edit(item: Item) { setForm({ ...item }); setEditingId(item.id!); }
  async function del(id: number) { if (!confirm("Delete this item?")) return; await fetch(`/api/menu/${id}`, { method: "DELETE" }); load(); }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data?.url) setForm({ ...form, imageUrl: data.url });
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-navy mb-6">Menu Admin</h1>

      <form onSubmit={save} className="bg-white rounded-xl warm-shadow p-6 mb-8 grid md:grid-cols-2 gap-4">
        <input className="border rounded-md p-3" placeholder="Name" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
        <input className="border rounded-md p-3" placeholder="Price" type="number" step="0.01" required value={form.price} onChange={e=>setForm({...form, price: parseFloat(e.target.value)})}/>
        <select className="border rounded-md p-3" value={form.category} onChange={e=>setForm({...form, category: e.target.value as Item['category']})}>
          {["coffee","espresso","tea","pastries","sandwiches","desserts"].map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <input className="border rounded-md p-3" placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl: e.target.value})}/>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onFile} />
          {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
        <textarea className="md:col-span-2 border rounded-md p-3" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form, isFeatured: e.target.checked})}/> Featured
        </label>
        <input className="border rounded-md p-3" placeholder="Ingredients (comma separated)" value={(form.ingredients||[]).join(", ")} onChange={e=>setForm({...form, ingredients: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/>
        <div className="md:col-span-2 flex gap-3">
          <button className="px-4 py-3 rounded-lg gold-gradient text-navy font-semibold">{editingId ? "Update Item" : "Create Item"}</button>
          <button type="button" onClick={()=>{setForm(empty); setEditingId(null);}} className="px-4 py-3 rounded-lg border">Reset</button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i, idx) => (
          <motion.div key={i.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} whileHover={{ y: -3 }} className="bg-white rounded-xl warm-shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-navy">{i.name}</div>
                <div className="text-sm text-gray-500 capitalize">{i.category}</div>
              </div>
              <div className="text-solis-gold font-bold">${i.price.toFixed(2)}</div>
            </div>
            <p className="text-gray-600 mt-2">{i.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>edit(i)} className="px-3 py-2 rounded-md border">Edit</button>
              <button onClick={()=>del(i.id!)} className="px-3 py-2 rounded-md border border-red-300 text-red-600">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
