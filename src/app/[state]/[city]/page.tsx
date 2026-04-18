import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SupplierCard from '@/components/SupplierCard';
import { BreadcrumbSchema, CityItemListSchema } from '@/components/SchemaMarkup';
import { getAllCities, getAllTradeCategories, getCityBySlug, getNearbyCities, getSuppliersByCity } from '@/lib/data';

interface Props {
  params: { state: string; city: string };
}

export function generateStaticParams() {
  return getAllCities().map((city) => ({ state: city.stateSlug, city: city.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.state, params.city);
  if (!city) return {};

  const suppliers = getSuppliersByCity(city.name);

  return {
    title: `Trade Supply Houses in ${city.name}, ${city.stateAbbr}`,
    description: `Compare ${suppliers.length} plumbing, HVAC, electrical, and general supply houses in ${city.name}, ${city.stateAbbr}.`,
    alternates: { canonical: `https://tradesupplyfinder.com/${params.state}/${params.city}` },
  };
}

export default function CityPage({ params }: Props) {
  const city = getCityBySlug(params.state, params.city);
  if (!city) notFound();

  const suppliers = getSuppliersByCity(city.name);
  const categories = getAllTradeCategories();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: city.state, href: `/${city.stateSlug}` },
          { name: `${city.name}, ${city.stateAbbr}`, href: `/${city.stateSlug}/${city.slug}` },
        ]}
      />
      <CityItemListSchema city={city} suppliers={suppliers} />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-navy-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.stateSlug}`} className="hover:text-navy-600">{city.state}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{city.name}, {city.stateAbbr}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-extrabold text-navy-800 md:text-4xl">Trade Supply Houses in {city.name}, {city.stateAbbr}</h1>
        <p className="mb-8 max-w-3xl text-gray-500">{city.description}</p>

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${city.stateSlug}/${city.slug}/${category.slug}`}
              className="rounded-full bg-navy-50 px-3 py-1.5 text-xs text-navy-700 transition-colors hover:bg-navy-100"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">{suppliers.length} Suppliers in {city.name}</h2>
        <div className="grid gap-4">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.slug} supplier={supplier} />
          ))}
        </div>

        {suppliers.length === 0 && (
          <p className="py-10 text-center text-gray-500">No suppliers listed in {city.name} yet.</p>
        )}

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Nearby Cities</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {getNearbyCities(city).map((nearby) => (
              <Link
                key={nearby.slug}
                href={`/${nearby.stateSlug}/${nearby.slug}`}
                className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-navy-300 hover:shadow-md"
              >
                <span className="text-sm font-semibold text-navy-800">{nearby.name}</span>
                <span className="mt-1 block text-xs text-gray-400">{nearby.stateAbbr}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="mb-2 text-base font-semibold">Do I need a contractor account to buy from supply houses in {city.name}?</h3>
              <p className="text-gray-600">Some branches are open to cash sales while others are account-first. Check each listing for account requirements and contractor pricing availability.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold">Which trades are covered in {city.name}?</h3>
              <p className="text-gray-600">TradeSupplyFinder covers plumbing, HVAC, electrical, and general supply locations. Use the trade filters above to narrow your results.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold">Can suppliers deliver directly to jobsites?</h3>
              <p className="text-gray-600">Many listed branches offer delivery for account customers. Review each supplier profile for delivery support and call ahead for cutoff times.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
