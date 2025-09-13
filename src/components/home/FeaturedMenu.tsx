"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Coffee, Leaf, Cookie, Sandwich, Cake } from "lucide-react";

type Size = { id: number; size: "small" | "large" | "single"; price: number };
type MilkUpcharge = { id: number; milkType: "regular" | "oat" | "almond" | "soy"; upcharge: number };
type Item = {
  id: number;
  name: string;
  description?: string | null;
  category: "coffee" | "cold-drinks" | "tea" | "pastries" | "sandwiches" | "desserts";
  isFeatured: boolean;
  hasMilk: boolean;
  sizes: Size[];
};

export default function FeaturedMenu() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [milkUpcharges, setMilkUpcharges] = useState<MilkUpcharge[]>([]);

  useEffect(() => {
    fetch("/api/menu?featured=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        // Handle the API response structure {items, milkUpcharges}
        const items = data.items || data;
        setFeatured(Array.isArray(items) ? items.slice(0, 4) : []);
        if (data.milkUpcharges && Array.isArray(data.milkUpcharges)) {
          setMilkUpcharges(data.milkUpcharges);
        }
      });
  }, []);

  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            Featured Favorites
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most beloved creations, crafted to delight your senses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((item, index) => {
            const getCategoryIcon = (category: string) => {
              switch (category) {
                case 'coffee':
                case 'cold-drinks':
                  return Coffee;
                case 'tea':
                  return Leaf;
                case 'pastries':
                  return Cookie;
                case 'sandwiches':
                  return Sandwich;
                case 'desserts':
                  return Cake;
                default:
                  return Coffee;
              }
            };

            const IconComponent = getCategoryIcon(item.category);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-6 warm-shadow hover-lift border border-solis-gold/10 h-full relative overflow-hidden group">
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
                    <div className="w-12 h-12 bg-solis-gold/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-solis-gold" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl text-navy group-hover:text-navy-light transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-xs uppercase tracking-wider text-solis-gold font-semibold">
                      {item.category.replace('-', ' ')}
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
                                    <div className="font-bold text-solis-gold text-sm">
                                      ${s.price.toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          // Single price for food items
                          <div className="text-center py-3">
                            <div className="font-bold text-solis-gold text-xl">
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
                                    {milk.milkType === 'regular' ? 'Dairy' : milk.milkType}+${milk.upcharge === 0 ? '0.00' : milk.upcharge.toFixed(2)}
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md solis-gradient text-white font-semibold hover:opacity-90 hover-lift"
          >
            View Full Menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
