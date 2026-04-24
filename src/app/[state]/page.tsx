import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema, StateFAQSchema, StateItemListSchema } from '@/components/SchemaMarkup';
import { getAllStateSlugs, getAllTradeCategories, getCitiesByState, getStateNameFromSlug, getSuppliersByState } from '@/lib/data';

interface Props {
  params: { state: string };
}

export function generateStaticParams() {
  return getAllStateSlugs().map((state) => ({ state }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cities = getCitiesByState(params.state);
  if (cities.length === 0) return {};

  const stateName = getStateNameFromSlug(params.state);
  const suppliers = getSuppliersByState(params.state);

  return {
    title: `Trade Supply Houses in ${stateName} — ${suppliers.length} Suppliers | TradeSupplyFinder`,
    description: `Compare ${suppliers.length} plumbing, HVAC, electrical, and general supply houses across ${cities.length} cities in ${stateName}. Find will-call hours, delivery options, brands, and contractor account details.`,
    alternates: { canonical: `https://tradesupplyfinder.com/${params.state}` },
    openGraph: {
      title: `Trade Supply Houses in ${stateName} | TradeSupplyFinder`,
      description: `${suppliers.length} supplier locations across ${cities.length} cities with will-call, delivery, and contractor pricing details.`,
      url: `https://tradesupplyfinder.com/${params.state}`,
    },
  };
}

export default function StatePage({ params }: Props) {
  const cities = getCitiesByState(params.state);
  if (cities.length === 0) notFound();

  const stateName = getStateNameFromSlug(params.state);
  const suppliers = getSuppliersByState(params.state);
  const trades = getAllTradeCategories();
  const tradeCounts = trades.map((trade) => {
    const tradeSuppliers = suppliers.filter((supplier) => supplier.trades.includes(trade.slug));
    const city = cities
      .map((candidate) => ({
        city: candidate,
        supplierCount: tradeSuppliers.filter((supplier) => supplier.city === candidate.name).length,
      }))
      .sort((a, b) => b.supplierCount - a.supplierCount || a.city.name.localeCompare(b.city.name))[0]?.city;

    return {
      ...trade,
      supplierCount: tradeSuppliers.length,
      city,
    };
  });
  const topCities = cities
    .map((city) => ({ city, supplierCount: suppliers.filter((supplier) => supplier.city === city.name).length }))
    .sort((a, b) => b.supplierCount - a.supplierCount || a.city.name.localeCompare(b.city.name))
    .slice(0, 6);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: stateName, href: `/${params.state}` },
        ]}
      />
      <StateItemListSchema stateName={stateName} suppliers={suppliers} />
      <StateFAQSchema stateName={stateName} cityCount={cities.length} supplierCount={suppliers.length} />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-navy-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{stateName}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-extrabold text-navy-800 md:text-4xl">Trade Supply Houses in {stateName}</h1>
        <p className="mb-8 max-w-3xl text-gray-500">
          Browse {suppliers.length} supplier locations across {cities.length} cities in {stateName}. Compare will-call hours, jobsite delivery, contractor pricing, account requirements, showroom availability, and stocked brands before you drive to the counter.
        </p>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold text-navy-800">{suppliers.length}</p>
            <p className="mt-1 text-xs text-gray-500">Suppliers</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold text-navy-800">{cities.length}</p>
            <p className="mt-1 text-xs text-gray-500">Cities</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold text-accent">{suppliers[0]?.rating ?? '—'}</p>
            <p className="mt-1 text-xs text-gray-500">Top Rating</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold text-navy-800">4</p>
            <p className="mt-1 text-xs text-gray-500">Trade Types</p>
          </div>
        </div>

        <section className="mb-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-2xl font-bold text-navy-800">Trade Coverage in {stateName}</h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              Filter the state directory by specialty so your crew can find the right counter for today&apos;s material run.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {tradeCounts.map((trade) => (
                <Link
                  key={trade.slug}
                  href={`/${params.state}/${trade.city?.slug ?? cities[0].slug}/${trade.slug}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-navy-300 hover:bg-white hover:shadow-md"
                >
                  <h3 className="font-semibold text-navy-800">{trade.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{trade.supplierCount} {trade.name.toLowerCase()} supplier{trade.supplierCount === 1 ? '' : 's'}</p>
                  {trade.city && <p className="mt-1 text-xs text-gray-400">Start in {trade.city.name}</p>}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-navy-100 bg-navy-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-navy-800">Best-Covered {stateName} Supply Markets</h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              These cities have the deepest listed supplier coverage, useful for comparing backup counters, delivery options, and trade-only inventory.
            </p>
            <div className="space-y-3">
              {topCities.map(({ city, supplierCount }) => (
                <Link
                  key={city.slug}
                  href={`/${city.stateSlug}/${city.slug}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-navy-300 hover:shadow-md"
                >
                  <span className="font-semibold text-navy-800">{city.name}</span>
                  <span className="text-xs text-gray-500">{supplierCount} supplier{supplierCount === 1 ? '' : 's'}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-navy-800">How to Choose a {stateName} Supply House</h2>
          <div className="space-y-5 text-sm leading-relaxed text-gray-600">
            <p>
              For urgent parts runs, prioritize suppliers with early will-call windows, accurate counter stock, and delivery coverage near the jobsite. For planned projects, compare contractor pricing programs, showroom support, and whether the branch requires a trade account.
            </p>
            <p>
              TradeSupplyFinder highlights practical branch details — brands, pickup hours, delivery, showroom availability, and account requirements — so plumbing, HVAC, electrical, and general contractors can pick the best local source before leaving the job.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-navy-800">Browse Cities</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.stateSlug}/${city.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-navy-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-navy-800">{city.name}</h3>
                <p className="mt-1 text-xs text-gray-400">{city.stateAbbr}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
