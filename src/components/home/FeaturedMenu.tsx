'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isFeatured: boolean;
};

export default function FeaturedMenu() {
  const [featured, setFeatured] = useState<Item[]>([]);
  useEffect(() => { fetch("/api/menu?featured=1").then(r=>r.json()).then(setFeatured); }, []);

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
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Featured Favorites</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our most beloved creations, carefully crafted to delight your senses</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden hover-lift group cursor-pointer border-0 warm-shadow bg-white rounded-xl"
            >
              <div className="aspect-square relative overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl || ""} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-md text-navy bg-solis-gold font-medium shadow-lg text-sm">Featured</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-navy group-hover:text-navy-light transition-colors">{item.name}</h3>
                  <span className="text-lg font-bold text-solis-gold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
