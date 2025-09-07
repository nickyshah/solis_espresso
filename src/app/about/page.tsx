'use client';

import React from "react";
import { Heart, Award, Coffee, Users, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Every cup is crafted with love and dedication to the art of coffee making."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We source ethically and support sustainable farming practices worldwide."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections and creating a space where everyone feels at home."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to the highest standards in quality, service, and experience."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 solis-gradient relative overflow-hidden pt-40">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-solis-gold max-w-3xl mx-auto">
              Where passion meets perfection, and every cup tells a story of dedication and craft
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-warm-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-navy mb-6">
                The Beginning
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Solis Espresso began as a dream in 2018, born from Maria and Carlos&apos;s shared passion
                  for extraordinary coffee and genuine human connection. After traveling the world and
                  experiencing coffee cultures from Ethiopia to Colombia, they returned home with a vision.
                </p>
                <p>
                  What started as a small neighborhood cafe has grown into a beloved community hub,
                  but our core values remain unchanged: exceptional quality, sustainable practices,
                  and creating moments of joy through the perfect cup of coffee.
                </p>
                <p>
                  Today, we continue to honor our founders&apos; vision by sourcing the finest beans,
                  supporting local communities, and creating an atmosphere where every guest feels
                  like family.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden warm-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=450&fit=crop"
                  alt="Cafe founders"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-cream to-cream-light">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from bean to cup
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover-lift group border-0 warm-shadow bg-white h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 solis-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-solis-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
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
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From bean to cup, every step is carefully crafted
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Source",
                description:
                  "We travel the world to find the finest coffee beans, building relationships with farmers who share our commitment to quality and sustainability."
              },
              {
                step: "02",
                title: "Roast",
                description:
                  "Our master roasters carefully craft each blend, using traditional techniques combined with modern precision to unlock every bean's potential."
              },
              {
                step: "03",
                title: "Serve",
                description:
                  "Our skilled baristas transform these premium beans into works of art, creating the perfect cup that brings joy to every sip."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 solis-gradient rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-solis-gold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
