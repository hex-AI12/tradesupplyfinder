import { cities } from '@/data/cities';
import { suppliers } from '@/data/suppliers';
import { tradeCategories } from '@/data/categories';
import { City, Supplier, TradeCategory, TradeCategorySlug } from '@/data/types';

export function getAllCities(): City[] {
  return cities;
}

export function getAllSuppliers(): Supplier[] {
  return suppliers;
}

export function getSupplierBySlug(slug: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.slug === slug);
}

export function getAllTradeCategories(): TradeCategory[] {
  return tradeCategories;
}

export function getTradeCategoryBySlug(slug: string): TradeCategory | undefined {
  return tradeCategories.find((category) => category.slug === slug);
}

export function getCityBySlug(stateSlug: string, citySlug: string): City | undefined {
  return cities.find((city) => city.stateSlug === stateSlug && city.slug === citySlug);
}

export function getCityByName(cityName: string): City | undefined {
  return cities.find((city) => city.name === cityName);
}

export function getCitiesByState(stateSlug: string): City[] {
  return cities.filter((city) => city.stateSlug === stateSlug);
}

export function getSuppliersByCity(cityName: string): Supplier[] {
  return suppliers
    .filter((supplier) => supplier.city === cityName)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
}

export interface CitySupplierInsights {
  deliveryCount: number;
  openCounterCount: number;
  contractorPricingCount: number;
  showroomCount: number;
  tradeCounts: Record<TradeCategorySlug, number>;
  topRatedSupplier?: Supplier;
}

export function getCitySupplierInsights(cityName: string): CitySupplierInsights {
  const citySuppliers = getSuppliersByCity(cityName);
  const tradeCounts: Record<TradeCategorySlug, number> = {
    plumbing: 0,
    hvac: 0,
    electrical: 0,
    general: 0,
  };

  for (const supplier of citySuppliers) {
    for (const trade of supplier.trades) {
      tradeCounts[trade] += 1;
    }
  }

  return {
    deliveryCount: citySuppliers.filter((supplier) => supplier.hasDelivery).length,
    openCounterCount: citySuppliers.filter((supplier) => !supplier.requiresAccount).length,
    contractorPricingCount: citySuppliers.filter((supplier) => supplier.hasContractorPricing).length,
    showroomCount: citySuppliers.filter((supplier) => supplier.hasShowroom).length,
    tradeCounts,
    topRatedSupplier: citySuppliers[0],
  };
}

export function getSuppliersByCityAndTrade(cityName: string, trade: TradeCategorySlug): Supplier[] {
  return getSuppliersByCity(cityName).filter((supplier) => supplier.trades.includes(trade));
}

export function getSuppliersByState(stateSlug: string): Supplier[] {
  const stateCities = new Set(getCitiesByState(stateSlug).map((city) => city.name));
  return suppliers
    .filter((supplier) => stateCities.has(supplier.city))
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
}

export function getAllStateSlugs(): string[] {
  return Array.from(new Set(cities.map((city) => city.stateSlug)));
}

export function getStateNameFromSlug(stateSlug: string): string {
  return cities.find((city) => city.stateSlug === stateSlug)?.state ?? stateSlug;
}

export function getAllStatesWithCounts(): { name: string; slug: string; cityCount: number; supplierCount: number }[] {
  const byState = new Map<string, { name: string; slug: string; cityCount: number; supplierCount: number }>();

  for (const city of cities) {
    if (!byState.has(city.stateSlug)) {
      byState.set(city.stateSlug, {
        name: city.state,
        slug: city.stateSlug,
        cityCount: 0,
        supplierCount: 0,
      });
    }

    const record = byState.get(city.stateSlug);
    if (record) {
      record.cityCount += 1;
    }
  }

  for (const supplier of suppliers) {
    const city = getCityByName(supplier.city);
    if (!city) continue;

    const record = byState.get(city.stateSlug);
    if (record) {
      record.supplierCount += 1;
    }
  }

  return Array.from(byState.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getTradeCoverageCounts(): Record<TradeCategorySlug, number> {
  const counts: Record<TradeCategorySlug, number> = {
    plumbing: 0,
    hvac: 0,
    electrical: 0,
    general: 0,
  };

  for (const supplier of suppliers) {
    for (const trade of supplier.trades) {
      counts[trade] += 1;
    }
  }

  return counts;
}

export function getNearbyCities(city: City, limit = 6): City[] {
  return cities
    .filter((candidate) => candidate.slug !== city.slug && candidate.stateSlug === city.stateSlug)
    .slice(0, limit);
}
