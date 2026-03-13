// ==========================================
// Cobble Quest - Type Definitions
// ==========================================

export type StoreCategory = 'keys' | 'breeding' | 'battlepass' | 'extras';

export interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  category: StoreCategory;
  description: string;
  discount?: number;
  /** Server commands to execute on purchase. Use {username} placeholder. */
  commands?: string[];
  active?: boolean;
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
  duration: 'monthly' | 'permanent';
  /** Server commands to execute on purchase */
  commands?: string[];
}

export interface ServerStats {
  playersOnline: number;
  maxPlayers: number;
  serverStatus: 'online' | 'offline' | 'maintenance' | 'checking';
}

export type EventTag = 'pvp' | 'capture' | 'exploration' | 'tournament' | 'seasonal' | 'special';

export interface ServerEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  tags: EventTag[];
  active: boolean;
}

// ---- Payments ----

export type PaymentMethod = 'paypal' | 'stripe';

export interface AvailablePaymentMethod {
  id: PaymentMethod;
  name: string;
  available: boolean;
}

export interface PaymentItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  /** Server commands to execute when this item is purchased */
  commands?: string[];
  /** Store item ID for server-side price verification */
  storeItemId?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  approvalUrl: string;
  method: PaymentMethod;
}

export interface CaptureOrderResponse {
  status: 'completed' | 'pending' | 'failed';
  orderId: string;
  payer?: { email?: string; name?: string };
  amount: number;
  currency: string;
}
