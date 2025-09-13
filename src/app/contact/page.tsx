'use client';

import React, { useState } from "react";
import { MapPin, Clock, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiry_type: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmitMessage("Thank you! Your message has been sent successfully. We'll be in touch soon!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiry_type: "general",
      });
    } catch (error) {
      setSubmitMessage("Sorry, there was an error sending your message. Please try again or call us directly.");
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Shop 2, 77 Berry Street", "North Sydney NSW 2060 Australia"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Fri: 6AM - 3:30PM", "Sat-Sun: Closed"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["(555) 123-COFFEE", "Available during business hours"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@solisespresso.com", "We respond within 24 hours"],
    },
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
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-solis-gold max-w-3xl mx-auto">
              We&apos;d love to hear from you! Whether you have questions, feedback, or want to plan an event
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-cream-light to-warm-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-0 bg-white warm-shadow">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-navy flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your name"
                          className="focus:border-solis-gold focus:ring-solis-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          className="focus:border-solis-gold focus:ring-solis-gold"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                          className="focus:border-solis-gold focus:ring-solis-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Inquiry Type
                        </label>
                        {/* simple controlled select using our minimal components */}
                        <div className="relative">
                          <select
                            className="w-full border rounded-md p-3 text-navy-light focus:outline-none focus:ring-solis-gold focus:border-solis-gold"
                            value={formData.inquiry_type}
                            onChange={(e) => handleInputChange("inquiry_type", e.target.value)}
                          >
                            <option value="general">General Inquiry</option>
                            <option value="catering">Catering</option>
                            <option value="events">Private Events</option>
                            <option value="feedback">Feedback</option>
                            <option value="partnerships">Partnerships</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="What's this about?"
                        className="focus:border-solis-gold focus:ring-solis-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Message *
                      </label>
                      <Textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us how we can help..."
                        className="focus:border-solis-gold focus:ring-solis-gold resize-none"
                      />
                    </div>

                    {submitMessage && (
                      <Alert className={submitMessage.includes("Thank you") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        <AlertDescription className={submitMessage.includes("Thank you") ? "text-green-800" : "text-red-800"}>
                          {submitMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gold-gradient hover:opacity-90 hover-lift text-navy font-semibold"
                      size="lg"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Whether you&apos;re planning a special event, interested in our catering services,
                  or just want to share your feedback, we&apos;re here to help make your experience exceptional.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="hover-lift border-0 warm-shadow bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full solis-gradient flex items-center justify-center">
                            <info.icon className="w-6 h-6 text-solis-gold" />
                          </div>
                          <div>
                            <h3 className="font-bold text-navy mb-2">{info.title}</h3>
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-gray-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Google Maps */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-0 warm-shadow">
                  <div className="aspect-video relative">
                    <iframe
                      src="https://maps.google.com/maps?q=Shop%202,%2077%20Berry%20Street,%20North%20Sydney%20NSW%202060,%20Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Solis Espresso Location"
                      className="absolute inset-0"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-solis-gold" />
                        <h3 className="font-bold text-navy text-sm">Solis Espresso</h3>
                      </div>
                      <p className="text-xs text-gray-600">Shop 2, 77 Berry Street<br />North Sydney NSW 2060</p>
                      <Button 
                        onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Shop%202,%2077%20Berry%20Street,%20North%20Sydney%20NSW%202060,%20Australia', '_blank')}
                        className="bg-solis-gold hover:bg-solis-gold/90 text-navy font-semibold text-xs px-3 py-1 mt-2 h-auto"
                        size="sm"
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
