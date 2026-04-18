export type TradeCategorySlug = 'plumbing' | 'hvac' | 'electrical' | 'general';

export interface Supplier {
  slug: string;
  name: string;
  city: string;
  state: string;
  stateAbbr: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  trades: TradeCategorySlug[];
  willCallHours: string;
  requiresAccount: boolean;
  hasDelivery: boolean;
  hasShowroom: boolean;
  hasContractorPricing: boolean;
  brands: string[];
  description: string;
}

export interface City {
  name: string;
  slug: string;
  state: string;
  stateAbbr: string;
  stateSlug: string;
  description: string;
}

export interface TradeCategory {
  slug: TradeCategorySlug;
  name: string;
  title: string;
  description: string;
}
