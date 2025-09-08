"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Size = { id: number; size: "small" | "large"; price: number };
type Item = {
  id: number;
  name: string;
  description?: string | null;
  category: "coffee" | "espresso" | "tea" | "pastries" | "sandwiches" | "desserts";
  isFeatured: boolean;
  sizes: Size[];
};

const categories = [
  { id: "all", label: "All Items" },
  { id: "coffee", label: "Coffee" },
  { id: "espresso", label: "Espresso" },
  { id: "tea", label: "Tea" },
  { id: "pastries", label: "Pastries" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "desserts", label: "Desserts" },
] as const;

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<(typeof categories)[number]["id"]>("all");

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 solis-gradient relative overflow-hidden pt-40">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Menu</h1>
            <p className="text-xl md:text-2xl text-solis-gold max-w-3xl mx-auto">
              Discover our carefully curated selection of premium coffee and delicious food
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-to-b from-cream-light to-warm-white">
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm warm-shadow border border-solis-gold/20 rounded-full p-1 flex gap-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active === c.id
                      ? "bg-solis-gold text-navy"
                      : "text-navy-light hover:text-navy"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, idx) => {
              const minPrice =
                item.sizes && item.sizes.length
                  ? Math.min(...item.sizes.map((s) => s.price))
                  : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                >
                  <div className="overflow-hidden hover-lift group cursor-pointer border-0 warm-shadow h-full bg-white rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-navy group-hover:text-navy-light transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-sm text-navy-light capitalize">
                        {item.category}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}

                    {/* Sizes */}
                    {item.sizes?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {item.sizes
                          .sort((a, b) => a.size.localeCompare(b.size))
                          .map((s) => (
                            <span
                              key={s.id}
                              className="inline-flex items-center gap-2 border border-solis-gold/30 text-navy-light rounded-full px-3 py-1 text-sm"
                            >
                              <span className="capitalize">{s.size}</span>
                              <span className="font-semibold text-navy">
                                ${s.price.toFixed(2)}
                              </span>
                            </span>
                          ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No sizes yet</div>
                    )}

                    {/* From price */}
                    <div className="mt-3 text-solis-gold font-bold">
                      {minPrice !== null
                        ? `From $${minPrice.toFixed(2)}`
                        : "Price unavailable"}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {!filtered.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-2xl font-bold text-navy mb-2">No items found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
