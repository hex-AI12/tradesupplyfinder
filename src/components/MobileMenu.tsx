'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/california', label: 'California' },
  { href: '/california/san-jose', label: 'San Jose' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuPanelId = 'mobile-navigation-panel';

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={menuPanelId}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className={`block h-0.5 w-6 bg-white transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {open && <button type="button" className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} aria-label="Close menu overlay" />}

      <aside id={menuPanelId} className={`fixed right-0 top-0 z-40 h-full w-72 bg-navy-900 p-6 pt-20 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-navy-700 text-accent' : 'text-gray-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
