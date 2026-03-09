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
  item: StoreItem;
  quantity: number;
  type: 'pokemon' | 'rank' | 'item';
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
