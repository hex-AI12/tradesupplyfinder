import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema, LocalBusinessSchema } from '@/components/SchemaMarkup';
import { getAllSuppliers, getCityByName, getSupplierBySlug, getTradeCategoryBySlug } from '@/lib/data';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSuppliers().map((supplier) => ({ slug: supplier.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const supplier = getSupplierBySlug(params.slug);
  if (!supplier) return {};

  return {
    title: `${supplier.name} in ${supplier.city}, ${supplier.stateAbbr}`,
    description: `${supplier.name} offers ${supplier.trades.join(', ')} supply services in ${supplier.city}, ${supplier.stateAbbr}. Rated ${supplier.rating}/5 from ${supplier.reviewCount} reviews.`,
    alternates: { canonical: `https://tradesupplyfinder.com/supplier/${params.slug}` },
  };
}

function boolLabel(value: boolean): string {
  return value ? 'Yes' : 'No';
}

export default function SupplierPage({ params }: Props) {
  const supplier = getSupplierBySlug(params.slug);
  if (!supplier) notFound();

  const city = getCityByName(supplier.city);
  if (!city) notFound();

  return (
    <>
      <LocalBusinessSchema supplier={supplier} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: supplier.state, href: `/${city.stateSlug}` },
          { name: `${supplier.city}, ${supplier.stateAbbr}`, href: `/${city.stateSlug}/${city.slug}` },
          { name: supplier.name, href: `/supplier/${supplier.slug}` },
        ]}
      />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-navy-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.stateSlug}`} className="hover:text-navy-600">{supplier.state}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.stateSlug}/${city.slug}`} className="hover:text-navy-600">{supplier.city}, {supplier.stateAbbr}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{supplier.name}</span>
        </nav>

        <article className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-extrabold text-navy-800">{supplier.name}</h1>
              <p className="text-gray-500">{supplier.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">{supplier.rating}</span>
              <span className="text-accent">★</span>
              <span className="text-xs text-gray-400">({supplier.reviewCount} reviews)</span>
            </div>
          </div>

          <p className="mb-6 leading-relaxed text-gray-600">{supplier.description}</p>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-bold text-navy-800">Contact</h2>
              <p className="text-gray-600"><strong>Phone:</strong> {supplier.phone}</p>
              <p className="text-gray-600"><strong>Will-Call:</strong> {supplier.willCallHours}</p>
            </div>
            <div>
              <h2 className="mb-2 font-bold text-navy-800">Service Features</h2>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Requires Account: {boolLabel(supplier.requiresAccount)}</li>
                <li>Delivery Available: {boolLabel(supplier.hasDelivery)}</li>
                <li>Showroom: {boolLabel(supplier.hasShowroom)}</li>
                <li>Contractor Pricing: {boolLabel(supplier.hasContractorPricing)}</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 font-bold text-navy-800">Trades</h2>
            <div className="flex flex-wrap gap-2">
              {supplier.trades.map((trade) => {
                const category = getTradeCategoryBySlug(trade);

                return (
                  <Link
                    key={trade}
                    href={`/${city.stateSlug}/${city.slug}/${trade}`}
                    className="rounded-full bg-navy-50 px-3 py-1.5 text-xs text-navy-700 hover:bg-navy-100"
                  >
                    {category?.name ?? trade}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 font-bold text-navy-800">Brands</h2>
            <div className="flex flex-wrap gap-2">
              {supplier.brands.map((brand) => (
                <span key={brand} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{brand}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-navy-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-bold text-navy-800">Need counter availability now?</h2>
            <p className="mb-4 text-sm text-gray-500">Call before heading over to confirm stock and same-day pickup windows.</p>
            <a
              href={`tel:${supplier.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-block rounded-lg bg-accent px-8 py-3 font-bold text-navy-900 transition-colors hover:bg-yellow-600"
            >
              Call {supplier.phone}
            </a>
          </div>
        </article>
      </div>
    </>
  );
}
