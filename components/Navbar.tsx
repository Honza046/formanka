'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { navLinks, site } from '@/lib/data';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <SiteLogo size="md" />
          <span className="hidden min-w-0 font-serif text-lg font-bold leading-tight text-navy transition-colors group-hover:text-navy-light sm:block">
            {site.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-6" aria-label="Hlavní navigace">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  isActive(link.href) ? 'text-navy' : 'text-navy/65'
                } ${isActive(link.href) ? 'underline decoration-gold decoration-2 underline-offset-8' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/pizza/objednat"
            className="inline-flex shrink-0 rounded-2xl bg-gold px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light"
          >
            Objednat pizzu
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/pizza/objednat"
            className="inline-flex rounded-2xl bg-gold px-4 py-2 text-xs font-semibold text-navy sm:text-sm"
          >
            Objednat
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy/10 text-navy"
            aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-navy/5 px-4 py-4 lg:hidden" aria-label="Mobilní navigace">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-cream hover:text-navy ${
                  isActive(link.href) ? 'bg-cream text-navy' : 'text-navy/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
