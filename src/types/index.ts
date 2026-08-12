export interface MonsterCan {
  id: string;
  name: string;
  flavor?: string;
  description?: string;
  category?: string;
  size?: string;
  country?: string;
  releaseYear?: number;
  imageUrl?: string;
  barcode?: string;
  caffeine?: number;
  sugar?: number;
  discontinued: boolean;
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

export interface CatalogMetadata {
  lastStartedAt?: any;
  lastCompletedAt?: any;
  lastSuccessfulAt?: any;
  totalProcessed?: number;
  totalCreated?: number;
  totalUpdated?: number;
  lastError?: string;
}

export interface CollectionStats {
  totalCans: number;
  uniqueCans: number;
  duplicates: number;
  flavors: number;
  countries: number;
}
