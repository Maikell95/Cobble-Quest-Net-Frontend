// ==========================================
// Cobble Quest - Type Definitions
// ==========================================

export interface StoreItem {
  id: number;
  name: string;
  image: string;
  price: number;
  category: 'pokemon' | 'items' | 'keys' | 'cosmetics' | 'bundles';
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
