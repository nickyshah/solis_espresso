"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Leaf, Cookie, Sandwich, Cake, Star, Salad } from "lucide-react";

type Size = { id: number; size: "small" | "large" | "single"; price: number };
type MilkUpcharge = { id: number; milkType: "regular" | "oat" | "almond" | "soy"; upcharge: number };
type BowlUpcharge = { id: number; addOnType: "rice" | "avocado"; upcharge: number };
type Item = {
  id: number;
  name: string;
  description?: string | null;
  category: "coffee" | "cold_drinks" | "tea" | "pastries" | "sandwiches" | "desserts" | "bowls";
  isFeatured: boolean;
  hasMilk: boolean;
  hasBowlAddons: boolean;
  sizes: Size[];
};

const categories = [
  { id: "all", label: "All Items", icon: null },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "cold_drinks", label: "Cold Drinks", icon: Coffee },
  { id: "tea", label: "Tea", icon: Leaf },
  { id: "pastries", label: "Pastries", icon: Cookie },
  { id: "sandwiches", label: "Sandwiches", icon: Sandwich },
  { id: "desserts", label: "Desserts", icon: Cake },
  { id: "bowls", label: "Bowls", icon: Salad },
] as const;

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [milkUpcharges, setMilkUpcharges] = useState<MilkUpcharge[]>([]);
  const [bowlUpcharges, setBowlUpcharges] = useState<BowlUpcharge[]>([]);
  const [active, setActive] = useState<(typeof categories)[number]["id"]>("all");

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch menu");
        const text = await r.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          return { items: [], milkUpcharges: [], bowlUpcharges: [] };
        }
      })
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        }
        if (data.milkUpcharges && Array.isArray(data.milkUpcharges)) {
          setMilkUpcharges(data.milkUpcharges);
        }
        if (data.bowlUpcharges && Array.isArray(data.bowlUpcharges)) {
          setBowlUpcharges(data.bowlUpcharges);
        }
      })
      .catch((err) => {
        console.error("Error loading menu:", err);
      });
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  // Only show categories that have items
  const visibleCategories = useMemo(() => {
    const categoriesWithItems = new Set(items.map((item) => item.category));
    return categories.filter(
      (c) => c.id === "all" || categoriesWithItems.has(c.id as Item["category"])
    );
  }, [items]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 solis-gradient relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-solis-gold/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-solis-gold/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-solis-gold/25 rounded-full"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Coffee className="w-16 h-16 mx-auto mb-4 text-solis-gold" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Our <span className="text-solis-gold">Menu</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Handcrafted beverages and artisanal treats, made with passion and the finest ingredients
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
            className="flex justify-center mb-16"
          >
            <div className="bg-white/90 backdrop-blur-sm warm-shadow border border-solis-gold/30 rounded-2xl p-2 flex flex-wrap gap-2 max-w-4xl">
              {visibleCategories.map((c, index) => {
                const IconComponent = c.icon;
                return (
                  <motion.button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      active === c.id
                        ? "bg-solis-gold text-navy shadow-lg transform scale-105"
                        : "text-navy-light hover:text-navy hover:bg-solis-gold/10"
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {c.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, idx) => {
              const minPrice =
                item.sizes && item.sizes.length
                  ? Math.min(...item.sizes.map((s) => s.price))
                  : null;
              const maxPrice =
                item.sizes && item.sizes.length
                  ? Math.max(...item.sizes.map((s) => s.price))
                  : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 warm-shadow hover-lift border border-solis-gold/10 h-full relative overflow-hidden">
                    {/* Featured badge */}
                    {item.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-solis-gold text-navy px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Category icon */}
                    <div className="mb-4">
                      {(() => {
                        const categoryData = categories.find(c => c.id === item.category);
                        const IconComponent = categoryData?.icon;
                        return IconComponent ? (
                          <div className="w-12 h-12 bg-solis-gold/10 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-solis-gold" />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-2xl text-navy group-hover:text-navy-light transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-xs uppercase tracking-wider text-solis-gold font-semibold">
                        {item.category.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                        {item.description}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="mt-auto">
                      {item.sizes?.length ? (
                        <div className="space-y-3">
                          {/* Size Pricing */}
                          {item.sizes.filter(s => s.size !== 'single').length > 0 ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-navy-light">Sizes</span>
                              </div>
                              <div className="flex gap-2">
                                {item.sizes
                                  .filter(s => s.size !== 'single')
                                  .sort((a, b) => a.size === 'small' ? -1 : 1)
                                  .map((s) => (
                                    <div
                                      key={s.id}
                                      className="flex-1 text-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                      <div className="capitalize text-xs font-medium text-navy mb-1">
                                        {s.size}
                                      </div>
                                      <div className="font-bold text-solis-gold text-lg">
                                        ${s.price.toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            // Single price for food items
                            <div className="text-center py-3">
                              <div className="font-bold text-solis-gold text-2xl">
                                ${item.sizes[0]?.price.toFixed(2)}
                              </div>
                            </div>
                          )}
                          
                          {/* Milk Options */}
                          {item.hasMilk && milkUpcharges.length > 0 && (
                            <div className="pt-3 border-t border-gray-100">
                              <div className="text-xs font-medium text-navy-light mb-2">Milk Options</div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                {milkUpcharges.map((milk) => (
                                  <div key={milk.id} className="py-1">
                                    <span className="capitalize text-gray-600">
                                      {milk.milkType === 'regular' ? 'Dairy' : milk.milkType}-${milk.upcharge === 0 ? '0.00' : milk.upcharge.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Bowl Add-ons */}
                          {item.hasBowlAddons && bowlUpcharges.length > 0 && (
                            <div className="pt-3 border-t border-gray-100">
                              <div className="text-xs font-medium text-navy-light mb-2">Add-ons</div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                {bowlUpcharges.map((addon) => (
                                  <div key={addon.id} className="py-1">
                                    <span className="capitalize text-gray-600">
                                      {addon.addOnType}+${addon.upcharge.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="text-gray-400 text-sm">Pricing coming soon</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {!filtered.length && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="col-span-full"
            >
              <div className="text-center py-20 bg-white rounded-2xl warm-shadow border border-solis-gold/10">
                <div className="w-24 h-24 bg-solis-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coffee className="w-12 h-12 text-solis-gold" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3">No items found</h3>
                <p className="text-gray-600 mb-6">We couldn't find any items in this category</p>
                <button
                  onClick={() => setActive('all')}
                  className="bg-solis-gold text-navy px-6 py-3 rounded-full font-semibold hover:bg-solis-gold-dark transition-colors"
                >
                  View All Items
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
