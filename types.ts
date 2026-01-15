export type AccountStatus = 'active' | 'cooldown';

export interface Product {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Account {
  id: string;
  email: string;
  status: AccountStatus;
  countdownStartAt: number | null; // Timestamp
  countdownEndAt: number | null;   // Timestamp
  createdAt: number;
}

export interface ProductAccount {
  id: string;
  productId: string;
  accountId: string;
}

// Helper type for the UI to display Account with its relation info
export interface EnrichedAccount extends Account {
  relationId: string; // The ID of the ProductAccount link
}