import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema, StateItemListSchema } from '@/components/SchemaMarkup';
import { getAllStateSlugs, getCitiesByState, getStateNameFromSlug, getSuppliersByState } from '@/lib/data';

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
    title: `Trade Supply Houses in ${stateName}`,
    description: `Compare ${suppliers.length} trade supply houses across ${cities.length} cities in ${stateName}.`,
    alternates: { canonical: `https://tradesupplyfinder.com/${params.state}` },
  };
}

export default function StatePage({ params }: Props) {
  const cities = getCitiesByState(params.state);
  if (cities.length === 0) notFound();

  const stateName = getStateNameFromSlug(params.state);
  const suppliers = getSuppliersByState(params.state);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: stateName, href: `/${params.state}` },
        ]}
      />
      <StateItemListSchema stateName={stateName} suppliers={suppliers} />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-navy-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{stateName}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-extrabold text-navy-800 md:text-4xl">Trade Supply Houses in {stateName}</h1>
        <p className="mb-8 max-w-3xl text-gray-500">
          Browse {suppliers.length} supplier locations across {cities.length} cities in {stateName}.
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
