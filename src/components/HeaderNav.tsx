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
    const base = 'relative text-lg font-medium nav-link px-1 py-0.5 transition-colors';
    if (active) return `${base} text-solis-gold is-active`;
    return `${base} ${isTransparent
      ? 'text-white nav-link--shadow hover:text-solis-gold'
      : 'text-navy hover:text-solis-gold'}`;
  };

  const isAdmin =
    session?.user?.email?.toLowerCase() ===
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent header--transparent'
          : 'bg-white/95 backdrop-blur-md warm-shadow'
      }`}
    >
      <nav className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 gold-gradient rounded-full grid place-items-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <div className="text-navy font-bold text-xl">S</div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-solis-gold rounded-full grid place-items-center">
                <div className="w-2 h-2 bg-navy rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Solis Espresso</h1>
              <p className="text-xs text-navy-light -mt-1 tracking-wider">
                Artisanal Coffee
              </p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className={linkClass('/admin')}>
                Admin
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-solis-gold font-medium"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden h-10 w-10 rounded-md grid place-items-center ${
              isTransparent ? 'text-white nav-link--shadow' : 'text-navy'
            } hover:bg-solis-gold/10`}
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
          <div className="md:hidden border-t border-solis-gold/20 bg-white warm-shadow">
            <div className="flex flex-col px-6 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 text-navy hover:text-solis-gold nav-link"
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" className="py-3 text-navy hover:text-solis-gold nav-link">
                  Admin
                </Link>
              )}
              {isAdmin && (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="py-3 text-navy hover:text-solis-gold nav-link text-left"
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
