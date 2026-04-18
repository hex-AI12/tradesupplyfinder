import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="bg-navy-800 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-accent">Trade</span>SupplyFinder
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/california" className="transition-colors hover:text-accent">
            California
          </Link>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}
