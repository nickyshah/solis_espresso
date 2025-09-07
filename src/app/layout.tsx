import type { Metadata } from "next";
import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Solis Espresso",
  description: "Artisanal Coffee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gradient-to-b from-cream-light to-amber-50">
        <HeaderNav />
        <main className="pt-24">{children}</main>

        <footer className="bg-navy text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gold-gradient rounded-full grid place-items-center">
                    <div className="text-navy font-bold text-lg">S</div>
                  </div>
                  <h3 className="text-2xl font-bold">Solis Espresso</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Where every cup tells a story of passion, quality, and community.
                </p>

                {/* Socials */}
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/solisespresso"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Solis Espresso on Instagram"
                    className="w-10 h-10 rounded-full grid place-items-center hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#E1306C" }} // Instagram pink
                  >
                    <FaInstagram size={20} color="white" />
                  </a>

                  <a
                    href="https://facebook.com/solisespresso"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Solis Espresso on Facebook"
                    className="w-10 h-10 rounded-full grid place-items-center hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#1877F2" }} // Facebook blue
                  >
                    <FaFacebook size={20} color="white" />
                  </a>

                  <a
                    href="https://twitter.com/solisespresso"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Solis Espresso on Twitter"
                    className="w-10 h-10 rounded-full grid place-items-center hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#0b151bff" }} // Twitter blue
                  >
                    {/* <FaTwitter size={20} color="white" /> */}
                    <FaXTwitter size={20} color="white" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-solis-gold">Opening Hours</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between"><span>Monday - Friday</span><span>7AM - 7PM</span></div>
                  <div className="flex justify-between"><span>Saturday - Sunday</span><span>Closed</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-solis-gold">Contact</h4>
                <div className="space-y-2 text-gray-300">
                  <p>123 Coffee Street</p>
                  <p>North Sydney, NSW 2060</p>
                  <p>(555) 123-COFFEE</p>
                  <p>hello@solisespresso.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-solis-gold/30 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Solis Espresso. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
