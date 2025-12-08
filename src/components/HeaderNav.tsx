'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

const NAV = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const { data: session } = useSession(); // ✅ inside the component

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false); // close mobile on route change
  }, [pathname]);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const linkClass = (href: string) => {
    const active = pathname === href;
    const base = 'px-4 py-2 rounded-xl backdrop-blur-sm border text-solis-gold font-medium transition-all duration-300';
    if (active) {
      return `${base} bg-solis-gold/25 border-solis-gold/50 shadow-lg shadow-solis-gold/10`;
    }
    return `${base} bg-white/10 border-white/20 hover:bg-white/20 hover:border-solis-gold/40`;
  };

  const isAdmin =
    session?.user?.email?.toLowerCase() ===
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase();

  return (
    <header
      className="z-50 bg-gradient-to-r from-navy via-navy-light to-slate-400"
    >
      <nav className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Solis Espresso Logo" 
                className="w-full h-full object-contain rounded-full shadow-lg ring-2 ring-solis-gold/30" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-solis-gold drop-shadow-sm">Solis Espresso</h1>
              <p className="text-xs text-solis-gold/70 -mt-1 tracking-wider">
                Artisanal Coffee
              </p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-2 rounded-xl bg-solis-gold/20 backdrop-blur-sm border border-solis-gold/40 text-solis-gold font-medium hover:bg-solis-gold/30 hover:border-solis-gold/60 transition-all duration-300 shadow-lg shadow-black/10"
              >
                Admin
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/40 text-red-300 font-medium hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 rounded-xl grid place-items-center text-solis-gold bg-white/10 backdrop-blur-sm border border-solis-gold/30 hover:bg-white/20 transition-all duration-300"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-solis-gold/20 bg-gradient-to-b from-navy/95 to-slate-500/90 backdrop-blur-lg rounded-b-2xl shadow-xl">
            <div className="flex flex-col px-6 py-4 gap-2">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-3 px-4 rounded-xl backdrop-blur-sm border text-solis-gold font-medium transition-all duration-300 ${
                      active 
                        ? 'bg-solis-gold/25 border-solis-gold/50' 
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-solis-gold/40'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="py-3 px-4 rounded-xl bg-solis-gold/20 backdrop-blur-sm border border-solis-gold/40 text-solis-gold font-medium hover:bg-solis-gold/30 transition-all duration-300"
                >
                  Admin
                </Link>
              )}
              {isAdmin && (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="py-3 px-4 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/40 text-red-300 font-medium hover:bg-red-500/30 transition-all duration-300 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
