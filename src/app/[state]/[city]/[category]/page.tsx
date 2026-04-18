import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SupplierCard from '@/components/SupplierCard';
import { BreadcrumbSchema } from '@/components/SchemaMarkup';
import { getAllCities, getAllTradeCategories, getCityBySlug, getSuppliersByCityAndTrade, getTradeCategoryBySlug } from '@/lib/data';

interface Props {
  params: { state: string; city: string; category: string };
}

export function generateStaticParams() {
  const cities = getAllCities();
  const categories = getAllTradeCategories();

  return cities.flatMap((city) => categories.map((category) => ({ state: city.stateSlug, city: city.slug, category: category.slug })));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.state, params.city);
  const category = getTradeCategoryBySlug(params.category);
  if (!city || !category) return {};

  const suppliers = getSuppliersByCityAndTrade(city.name, category.slug);

  return {
    title: `${category.title} in ${city.name}, ${city.stateAbbr}`,
    description: `Find ${suppliers.length} ${category.name.toLowerCase()} options in ${city.name}, ${city.stateAbbr}.`,
    alternates: { canonical: `https://tradesupplyfinder.com/${params.state}/${params.city}/${params.category}` },
  };
}

export default function CategoryPage({ params }: Props) {
  const city = getCityBySlug(params.state, params.city);
  const category = getTradeCategoryBySlug(params.category);
  if (!city || !category) notFound();

  const suppliers = getSuppliersByCityAndTrade(city.name, category.slug);
  const otherCategories = getAllTradeCategories().filter((entry) => entry.slug !== category.slug);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: city.state, href: `/${city.stateSlug}` },
          { name: `${city.name}, ${city.stateAbbr}`, href: `/${city.stateSlug}/${city.slug}` },
          { name: category.name, href: `/${city.stateSlug}/${city.slug}/${category.slug}` },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-navy-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.stateSlug}`} className="hover:text-navy-600">{city.state}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.stateSlug}/${city.slug}`} className="hover:text-navy-600">{city.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{category.name}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-extrabold text-navy-800 md:text-4xl">{category.title} in {city.name}, {city.stateAbbr}</h1>
        <p className="mb-8 max-w-3xl text-gray-500">{category.description}</p>

        <h2 className="mb-4 text-xl font-bold">{suppliers.length} Suppliers</h2>
        <div className="grid gap-4">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.slug} supplier={supplier} />
          ))}
        </div>

        {suppliers.length === 0 && (
          <p className="py-10 text-center text-gray-500">No {category.name.toLowerCase()} locations listed for {city.name} yet.</p>
        )}

        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-bold">Other Trades in {city.name}</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((entry) => (
              <Link
                key={entry.slug}
                href={`/${city.stateSlug}/${city.slug}/${entry.slug}`}
                className="rounded-full bg-navy-50 px-3 py-1.5 text-xs text-navy-700 transition-colors hover:bg-navy-100"
              >
                {entry.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold">FAQ — {category.name} in {city.name}</h2>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="mb-2 text-base font-semibold">Do {category.name.toLowerCase()} suppliers in {city.name} offer will-call pickup?</h3>
              <p className="text-gray-600">Most branches listed here support will-call pickup during posted counter hours. Always call ahead for same-day availability on critical items.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold">Can I get contractor pricing without an account?</h3>
              <p className="text-gray-600">Some locations offer cash sales, but best pricing is usually tied to a contractor account. Each supplier page notes account and contractor pricing details.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
