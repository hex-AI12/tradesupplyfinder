import { MetadataRoute } from 'next';
import { getAllCities, getAllStateSlugs, getAllSuppliers, getAllTradeCategories } from '@/lib/data';

const BASE_URL = 'https://tradesupplyfinder.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getAllCities();
  const states = getAllStateSlugs();
  const suppliers = getAllSuppliers();
  const categories = getAllTradeCategories();

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
  ];

  const statePages = states.map((state) => ({
    url: `${BASE_URL}/${state}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const cityPages = cities.map((city) => ({
    url: `${BASE_URL}/${city.stateSlug}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryPages = cities.flatMap((city) =>
    categories.map((category) => ({
      url: `${BASE_URL}/${city.stateSlug}/${city.slug}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const supplierPages = suppliers.map((supplier) => ({
    url: `${BASE_URL}/supplier/${supplier.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...categoryPages, ...supplierPages];
}
