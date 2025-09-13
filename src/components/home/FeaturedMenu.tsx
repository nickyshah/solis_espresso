"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

type Size = { id: number; size: "small" | "large" | "single"; price: number };
type Item = {
  id: number;
  name: string;
  description?: string | null;
  isFeatured: boolean;
  sizes: Size[];
};

export default function FeaturedMenu() {
  const [featured, setFeatured] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/menu?featured=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        // Handle the API response structure {items, milkUpcharges}
        const items = data.items || data;
        setFeatured(Array.isArray(items) ? items.slice(0, 4) : []);
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
            const minPrice =
              item.sizes && item.sizes.length
                ? Math.min(...item.sizes.map((s) => s.price))
                : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="overflow-hidden hover-lift group cursor-pointer border-0 warm-shadow bg-white rounded-xl p-6 h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-navy group-hover:text-navy-light transition-colors">
                      {item.name}
                    </h3>
                    {item.isFeatured && (
                      <div className="flex items-center gap-1 text-solis-gold">
                        <Star className="w-4 h-4 fill-solis-gold" />
                        <span className="text-sm">Featured</span>
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                  <div className="text-navy font-semibold">
                    {minPrice !== null
                      ? `From $${minPrice.toFixed(2)}`
                      : "Price unavailable"}
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
