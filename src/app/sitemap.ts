import type { MetadataRoute } from 'next';
import { getAllCities, getAllStateSlugs, getAllSuppliers, getAllTradeCategories } from '@/lib/data';

const siteUrl = 'https://tradesupplyfinder.com';
const currentDate = new Date();

function entry(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const stateRoutes = getAllStateSlugs().map((state) => entry(`/${state}`, 0.8));
  const cityRoutes = getAllCities().map((city) => entry(`/${city.stateSlug}/${city.slug}`, 0.9));
  const categoryRoutes = getAllCities().flatMap((city) =>
    getAllTradeCategories().map((category) => entry(`/${city.stateSlug}/${city.slug}/${category.slug}`, 0.7))
  );
  const supplierRoutes = getAllSuppliers().map((supplier) => entry(`/supplier/${supplier.slug}`, 0.9));

  return [entry('/', 1), ...stateRoutes, ...cityRoutes, ...categoryRoutes, ...supplierRoutes];
}
