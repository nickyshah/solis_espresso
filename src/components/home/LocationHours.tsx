'use client';
import { motion } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";

export default function LocationHours() {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Visit Us Today</h2>
              <p className="text-xl text-gray-600 mb-8">Located in the heart of North Sydney, we're easy to find and even easier to love.</p>
            </motion.div>

            {[
              { icon: MapPin, title: "Location", text: "Shop 3, 77 Berry Street, North Sydney NSW 2060 Australia" },
              { icon: Clock, title: "Opening Hours", text: "Mon-Fri 5:30AM-4:00PM · Sat-Sun Closed" },
              { icon: Phone, title: "Contact", text: "info@solisespresso.com" },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 * (i+1) }} viewport={{ once: true }}
                className="hover-lift border-0 warm-shadow bg-white rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 solis-gradient rounded-full grid place-items-center shadow-lg">
                  <c.icon className="w-6 h-6 text-solis-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{c.title}</h3>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden warm-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop" alt="Solis Espresso Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 gold-gradient rounded-full grid place-items-center shadow-xl">
              <span className="text-3xl text-navy">☕</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
