export interface HouseServiceProvider {
  id: number;
  category: string;
  name: string;
  service_description: string;
  phone?: string | null;
  brand_badge?: string | null;
}

export type HouseServiceProviderResponse = HouseServiceProvider;

export interface HouseDetail {
  id: number;
  address: string;
  city: string;
  district: string;
  postal_code?: string | null;
  fias_code?: string | null;
  cadastral_number?: string | null;
  oktmo?: string | null;
  year_built?: number | null;
  wear_percentage?: number | null;
  total_area?: number | null;
  living_area?: number | null;
  floors?: number | null;
  entrances?: number | null;
  apartments_count?: number | null;
  project_series?: string | null;
  wall_material?: string | null;
  management_type?: string | null;
  uk_name?: string | null;
  uk_inn?: string | null;
  chairman_name?: string | null;
  dispatcher_phone?: string | null;
  emergency_phone?: string | null;
  providers: HouseServiceProvider[];
}

export type HouseDetailResponse = HouseDetail;

export interface HouseCard {
  id: number;
  address: string;
  city: string;
  district: string;
  apartments_count: number;
  residents_count: number;
  residents_percent: number;
  active_tickets: number;
  active_polls: number;
  new_posts: number;
}

export type HouseCardResponse = HouseCard;
