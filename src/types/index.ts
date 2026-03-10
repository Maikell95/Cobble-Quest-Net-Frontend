// ==========================================
// Cobble Quest - Type Definitions
// ==========================================

export type StoreCategory = 'keys' | 'breeding' | 'battlepass' | 'extras';

export interface StoreItem {
  id: number;
  name: string;
  image: string;
  price: number;
  category: StoreCategory;
  description: string;
  discount?: number;
}

export interface CartItem {
  item: StoreItem | RankItem;
  quantity: number;
  type: 'pokemon' | 'rank' | 'item';
}

export interface RankItem {
  id: number;
  name: string;
  price: number;
  tebexPackageId?: number;
  duration: 'monthly' | 'permanent';
}

export interface ServerStats {
  playersOnline: number;
  maxPlayers: number;
  serverStatus: 'online' | 'offline' | 'maintenance' | 'checking';
}

export type EventTag = 'pvp' | 'capture' | 'exploration' | 'tournament' | 'seasonal' | 'special';

export interface ServerEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  tags: EventTag[];
  active: boolean;
}

// ---- Tebex ----

export interface TebexPackage {
  id: number;
  name: string;
  description: string;
  image: string | null;
  base_price: number;
  total_price: number;
  currency: string;
  category: { id: number; name: string } | null;
}

export interface TebexBasket {
  ident: string;
  complete: boolean;
  username: string | null;
  packages: TebexBasketItem[];
  base_price: number;
  total_price: number;
  currency: string;
  links: { checkout: string };
}

export interface TebexBasketItem {
  id: number;
  quantity: number;
  package: TebexPackage;
  price: number;
}
