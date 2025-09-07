'use client';

import React from "react";
import Link from "next/link";
import { Coffee, Star, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background Image with soft parallax feel */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(rgba(43, 58, 77, 0.6), rgba(43, 58, 77, 0.4)), url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop")',
          transform: "scale(1.1)",
          transformOrigin: "center center",
        }}
      />

      {/* Top-corner Badge (Base44 style) */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="absolute left-6 md:left-12 top-24 md:top-28 z-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-white border border-solis-gold/30"
      >
        <Star className="w-4 h-4 text-solis-gold fill-current" />
        <span className="text-sm font-medium">Award-Winning Coffee</span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Where Coffee
                <br />
                <span className="text-solis-gold">Meets Passion</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Experience the perfect blend of artisanal craftsmanship and premium beans,
                served in a warm, welcoming atmosphere.
              </p>

              {/* CTA Buttons (with icons & micro-interactions) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/menu" className="group">
                  <Button
                    size="lg"
                    className="bg-solis-gold hover:bg-solis-gold-dark text-navy font-semibold hover-lift group glow-effect"
                  >
                    <Coffee className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                    Explore Our Menu
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/about" className="group">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/80 text-white hover:text-navy backdrop-blur-sm hover-lift font-semibold group"
                  >
                    <BookOpen className="w-5 h-5 mr-2 transition-colors group-hover:text-navy" />
                    Discover Our Story
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              {/* <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-8 pt-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-solis-gold">50+</div>
                  <div className="text-sm text-gray-300">Premium Blends</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-solis-gold">10k+</div>
                  <div className="text-sm text-gray-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-solis-gold">5★</div>
                  <div className="text-sm text-gray-300">Average Rating</div>
                </div>
              </motion.div> */}
            </motion.div> 
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-solis-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
