'use client';
import { motion } from "framer-motion";
import { Coffee, Heart, Award, Users } from "lucide-react";

const features = [
  { Icon: Coffee, title: "Premium Quality", description: "We source only the finest beans from sustainable farms around the world." },
  { Icon: Heart, title: "Crafted with Love", description: "Our skilled baristas pour their passion into every drink." },
  { Icon: Award, title: "Award-Winning", description: "Recognized for outstanding quality and service." },
  { Icon: Users, title: "Community Focused", description: "We build a community where everyone feels welcome." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-cream to-cream-light">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Why Choose Solis?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We deliver an extraordinary coffee experience that goes beyond expectations</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center hover-lift group border-0 warm-shadow bg-white/80 backdrop-blur-sm rounded-xl p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 solis-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <f.Icon className="w-8 h-8 text-solis-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-navy-light transition-colors">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
