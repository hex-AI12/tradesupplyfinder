import Link from 'next/link';

const popularCities = [
  { name: 'San Jose', href: '/california/san-jose' },
  { name: 'San Francisco', href: '/california/san-francisco' },
  { name: 'Oakland', href: '/california/oakland' },
  { name: 'Fremont', href: '/california/fremont' },
  { name: 'Sunnyvale', href: '/california/sunnyvale' },
  { name: 'Santa Clara', href: '/california/santa-clara' },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">
            <span className="text-accent">Trade</span>SupplyFinder
          </h3>
          <p className="text-sm leading-relaxed">
            Find plumbing, HVAC, electrical, and general trade supply houses with accurate location data and contractor-focused details.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Popular Cities</h4>
          <ul className="space-y-1 text-sm">
            {popularCities.map((city) => (
              <li key={city.href}>
                <Link href={city.href} className="transition-colors hover:text-accent">
                  {city.name}, CA
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Browse Trades</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/california/san-jose/plumbing" className="transition-colors hover:text-accent">Plumbing Supply</Link></li>
            <li><Link href="/california/san-jose/hvac" className="transition-colors hover:text-accent">HVAC Supply</Link></li>
            <li><Link href="/california/san-jose/electrical" className="transition-colors hover:text-accent">Electrical Supply</Link></li>
            <li><Link href="/california/san-jose/general" className="transition-colors hover:text-accent">General Supply</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-700 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} TradeSupplyFinder. All rights reserved.
      </div>
    </footer>
  );
}
