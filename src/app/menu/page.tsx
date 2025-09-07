'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

type Item = {
  id: number;
  name: string;
  description?: string;
  category: "coffee" | "espresso" | "tea" | "pastries" | "sandwiches" | "desserts";
  price: number;
  imageUrl?: string;
  isFeatured: boolean;
  ingredients?: string[];
};

const categories = [
  { id: "all", label: "All Items" },
  { id: "coffee", label: "Coffee" },
  { id: "espresso", label: "Espresso" },
  { id: "tea", label: "Tea" },
  { id: "pastries", label: "Pastries" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "desserts", label: "Desserts" }
] as const;

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState("all");

  useEffect(() => { fetch("/api/menu").then(r=>r.json()).then(setItems); }, []);
  const filtered = active === "all" ? items : items.filter(i => i.category === active);

  return (
    <div className="min-h-screen">
      <section className="py-20 solis-gradient text-white text-center overflow-hidden relative">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-bold mb-4">Our Menu</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-xl text-solis-gold">Carefully curated selection of premium coffee, food & treats</motion.p>
      </section>

      <section className="py-12 bg-gradient-to-b from-cream-light to-warm-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((c, i) => (
                <motion.button key={c.id} onClick={() => setActive(c.id)} whileTap={{ scale: 0.98 }}
                  className={"px-4 py-2 rounded-full border " + (active===c.id ? "bg-solis-gold text-navy border-solis-gold" : "text-navy border-solis-gold/30 hover:border-solis-gold")}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  {c.label}
                </motion.button>
              ))}
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.05}>
                <motion.div whileHover={{ y: -4 }} className="overflow-hidden border-0 warm-shadow bg-white rounded-xl flex flex-col">
                  <div className="aspect-square bg-cream overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center solis-gradient"><span className="text-solis-gold text-6xl">☕</span></div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-navy">{item.name}</h3>
                      <span className="text-xl font-bold text-solis-gold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-1">{item.description}</p>
                    <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {filtered.length===0 && (
            <FadeIn>
              <div className="text-center py-20">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-2xl font-bold text-navy mb-2">No items found</h3>
                <p className="text-gray-600">Try selecting a different category</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
