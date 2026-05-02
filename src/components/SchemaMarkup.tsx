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

export function CityFAQSchema({ city }: { city: City }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Do I need a contractor account to buy from supply houses in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Some ${city.name}, ${city.stateAbbr} supply branches are open to cash sales while others are account-first. Each TradeSupplyFinder listing notes account requirements and contractor pricing availability.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which trades are covered in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `TradeSupplyFinder covers plumbing, HVAC, electrical, and general supply locations in ${city.name}. Use the trade filters on the city page to narrow results by specialty.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can ${city.name} suppliers deliver directly to jobsites?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Many listed ${city.name} branches offer jobsite delivery for account customers. Review each supplier profile for delivery support and call ahead for order cutoff times.`,
        },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function TradeCategoryItemListSchema({
  city,
  tradeName,
  suppliers,
}: {
  city: City;
  tradeName: string;
  suppliers: Supplier[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tradeName} in ${city.name}, ${city.stateAbbr}`,
    numberOfItems: suppliers.length,
    itemListElement: suppliers.map((supplier, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Store',
        name: supplier.name,
        telephone: supplier.phone,
        url: `${BASE_URL}/supplier/${supplier.slug}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: supplier.address,
          addressLocality: supplier.city,
          addressRegion: supplier.stateAbbr,
          addressCountry: 'US',
        },
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function TradeCategoryFAQSchema({ city, tradeName }: { city: City; tradeName: string }) {
  const lowerTradeName = tradeName.toLowerCase();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Do ${lowerTradeName} suppliers in ${city.name} offer will-call pickup?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most ${lowerTradeName} suppliers listed for ${city.name}, ${city.stateAbbr} support will-call pickup during posted counter hours. Contractors should call ahead for same-day availability on critical items.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get contractor pricing without an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Some trade supply locations offer cash sales, but best pricing is usually tied to a contractor account. Each supplier page notes account requirements and contractor pricing details.',
        },
      },
    ],
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
