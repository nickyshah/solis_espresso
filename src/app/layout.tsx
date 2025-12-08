import type { Metadata } from "next";
import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; // ⬅️ add this

export const metadata: Metadata = {
  title: "Solis Espresso",
  description: "Artisanal Coffee",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-cream-light">
        <Providers>
          <HeaderNav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
