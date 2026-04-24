import { City, Supplier } from '@/data/types';

const BASE_URL = 'https://tradesupplyfinder.com';

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TradeSupplyFinder',
    url: BASE_URL,
    description: 'Find and compare trade supply houses for plumbing, HVAC, electrical, and general contractors.',
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; href: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function CityItemListSchema({ city, suppliers }: { city: City; suppliers: Supplier[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Trade Supply Houses in ${city.name}, ${city.stateAbbr}`,
    numberOfItems: suppliers.length,
    itemListElement: suppliers.map((supplier, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Store',
        name: supplier.name,
        telephone: supplier.phone,
        url: `${BASE_URL}/supplier/${supplier.slug}`,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function StateItemListSchema({
  stateName,
  suppliers,
}: {
  stateName: string;
  suppliers: Supplier[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top Trade Supply Houses in ${stateName}`,
    numberOfItems: suppliers.length,
    itemListElement: suppliers.slice(0, 10).map((supplier, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Store',
        name: supplier.name,
        url: `${BASE_URL}/supplier/${supplier.slug}`,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function StateFAQSchema({
  stateName,
  cityCount,
  supplierCount,
}: {
  stateName: string;
  cityCount: number;
  supplierCount: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I choose a trade supply house in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Compare will-call hours, delivery availability, contractor pricing, account requirements, trade specialty, and brand inventory. TradeSupplyFinder lists ${supplierCount} supplier locations across ${cityCount} ${stateName} cities so contractors can compare options before driving to the counter.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which trade suppliers are listed in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `TradeSupplyFinder covers plumbing, HVAC, electrical, and general contractor supply houses in ${stateName}, including pro counters with will-call pickup, jobsite delivery, showroom support, and contractor account programs.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Do supply houses require a contractor account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Some trade supply houses sell over the counter, while others are trade-only or reserve best pricing for account holders. Check each listing for account requirements, contractor pricing, and pickup hours before visiting.',
        },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function LocalBusinessSchema({ supplier }: { supplier: Supplier }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: supplier.name,
    telephone: supplier.phone,
    description: supplier.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: supplier.address,
      addressLocality: supplier.city,
      addressRegion: supplier.stateAbbr,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: supplier.rating,
      reviewCount: supplier.reviewCount,
    },
    url: `${BASE_URL}/supplier/${supplier.slug}`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
