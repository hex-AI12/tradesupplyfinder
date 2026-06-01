import Link from 'next/link';
import { Supplier } from '@/data/types';

export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/supplier/${supplier.slug}`} aria-label={`View details for ${supplier.name}`}>
            <h3 className="text-lg font-bold text-navy-800 transition-colors hover:text-navy-600">{supplier.name}</h3>
          </Link>
          <p className="text-sm text-gray-500">{supplier.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-accent">
            {supplier.rating} <span aria-hidden="true">★</span>
          </span>
          <span className="text-xs text-gray-400">({supplier.reviewCount} reviews)</span>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">{supplier.description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {supplier.trades.map((trade) => (
          <span key={trade} className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700">
            {trade}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{supplier.phone}</span>
        <Link
          href={`/supplier/${supplier.slug}`}
          aria-label={`View details for ${supplier.name}`}
          className="text-sm font-semibold text-navy-600 transition-colors hover:text-navy-800"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
