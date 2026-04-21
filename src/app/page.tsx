import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { WebSiteSchema } from '@/components/SchemaMarkup';
import { getAllCities, getAllStateSlugs, getAllStatesWithCounts, getAllSuppliers, getAllTradeCategories, getTradeCoverageCounts } from '@/lib/data';

export default function HomePage() {
  const cities = getAllCities();
  const suppliers = getAllSuppliers();
  const states = getAllStatesWithCounts();
  const trades = getAllTradeCategories();
  const tradeCounts = getTradeCoverageCounts();
  const stateCount = getAllStateSlugs().length;

  const featuredCitySlugs = ['san-jose', 'san-francisco', 'houston', 'dallas', 'austin', 'miami', 'tampa', 'orlando', 'new-york-city', 'brooklyn', 'buffalo', 'albany'];

  return (
    <>
      <WebSiteSchema />

      <section className="bg-gradient-to-br from-navy-800 to-navy-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">Find Trade Supply Houses Near You</h1>
          <p className="mb-8 text-lg text-navy-200 md:text-xl">Plumbing, HVAC, electrical, and general supply branches for working contractors.</p>
          <SearchBar cities={cities} />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-navy-800 md:text-3xl">{suppliers.length}</p>
              <p className="text-xs text-gray-500 md:text-sm">Suppliers Listed</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 md:text-3xl">{cities.length}</p>
              <p className="text-xs text-gray-500 md:text-sm">Cities Covered</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 md:text-3xl">{stateCount}</p>
              <p className="text-xs text-gray-500 md:text-sm">States</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Browse by Trade</h2>
        <p className="mb-10 text-center text-gray-500">Filter suppliers by specialty before you drive to the counter.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/california/san-jose/${trade.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-navy-300 hover:shadow-md"
            >
              <h3 className="mb-1 font-bold text-navy-800">{trade.name}</h3>
              <p className="mb-3 text-sm text-gray-500">{trade.description}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-600">{tradeCounts[trade.slug]} suppliers</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Featured Cities</h2>
          <p className="mb-10 text-center text-gray-500">Coverage across major contractor markets in California, Texas, Florida, and New York.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cities
              .filter((city) => featuredCitySlugs.includes(city.slug))
              .map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.stateSlug}/${city.slug}`}
                  className="rounded-xl border border-gray-200 p-5 text-center transition-all hover:border-navy-300 hover:shadow-md"
                >
                  <h3 className="font-semibold text-navy-800">{city.name}</h3>
                  <p className="mt-1 text-xs text-gray-400">{city.stateAbbr}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Why TradeSupplyFinder</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Real contractor details',
              description: 'See will-call hours, delivery availability, contractor pricing, and account requirements before showing up.',
            },
            {
              title: 'Trade-specific filtering',
              description: 'Jump directly to plumbing, HVAC, electrical, or general supply houses by city and compare options quickly.',
            },
            {
              title: 'Fast location coverage',
              description: 'City and supplier pages are structured for fast lookup when you need parts for today\'s jobs.',
            },
          ].map((item, index) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-2xl font-extrabold text-navy-700">{index + 1}</div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Browse by State</h2>
        <p className="mb-10 text-center text-gray-500">Trade supply directory coverage</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {states.map((state) => (
            <Link
              key={state.slug}
              href={`/${state.slug}`}
              className="group rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-navy-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-navy-800 transition-colors group-hover:text-navy-600">{state.name}</h3>
              <p className="mt-1 text-xs text-gray-400">{state.cityCount} cities • {state.supplierCount} suppliers</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
