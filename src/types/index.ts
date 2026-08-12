/** Source tracking for catalog synchronization */
export interface CanSource {
  provider: string; // 'open-food-facts', 'monster-energy', 'community', 'manual'
  externalId?: string;
  url?: string;
  lastCheckedAt?: any; // Firestore Timestamp
}

/** Monster Energy can product information */
export interface MonsterCan {
  id: string;
  brand: string; // e.g., "Monster Energy"
  name: string;
  flavor?: string;
  description?: string;
  category?: string;
  country?: string;
  size?: string;
  barcode?: string;
  imageUrl?: string;
  releaseYear?: number;
  caffeine?: number;
  sugar?: number;
  discontinued: boolean;
  edition?: string; // Special edition info
  verified: boolean; // Manually verified
  sources: CanSource[]; // Track data sources
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface CollectionItem {
  canId: string;
  quantity: number;
  addedAt: any; // Firestore Timestamp
  notes?: string;
}

export interface WishlistItem {
  canId: string;
  addedAt: any; // Firestore Timestamp
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: any; // Firestore Timestamp
}

/** Catalog synchronization metadata and tracking */
export interface CatalogMetadata {
  lastStartedAt?: any;
  lastCompletedAt?: any;
  lastSuccessfulAt?: any;
  totalProcessed?: number;
  totalCreated?: number;
  totalUpdated?: number;
  totalSkipped?: number;
  lastError?: string;
}

export interface CollectionStats {
  totalCans: number;
  uniqueCans: number;
  duplicates: number;
  flavors: number;
  countries: number;
}
