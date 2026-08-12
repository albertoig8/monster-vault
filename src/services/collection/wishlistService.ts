import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { WishlistItem, MonsterCan } from '../../types';
import { canService } from '../cans/canService';

export const wishlistService = {
  // Obter wishlist do usuário com dados das latas
  async getUserWishlist(userId: string): Promise<(WishlistItem & { can: MonsterCan })[]> {
    try {
      const wishlistRef = collection(db, `users/${userId}/wishlist`);
      const querySnapshot = await getDocs(wishlistRef);

      const items = [];
      for (const docSnap of querySnapshot.docs) {
        const canId = docSnap.id;
        const can = await canService.getCanById(canId);
        if (can) {
          items.push({
            ...(docSnap.data() as WishlistItem),
            can,
          });
        }
      }

      return items;
    } catch (error) {
      console.error('Erro ao buscar wishlist:', error);
      throw error;
    }
  },

  // Adicionar lata à wishlist
  async addToWishlist(userId: string, canId: string): Promise<void> {
    try {
      await setDoc(doc(db, `users/${userId}/wishlist`, canId), {
        canId,
        addedAt: Timestamp.now(),
      } as WishlistItem);
    } catch (error) {
      console.error('Erro ao adicionar à wishlist:', error);
      throw error;
    }
  },

  // Remover lata da wishlist
  async removeFromWishlist(userId: string, canId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, `users/${userId}/wishlist`, canId));
    } catch (error) {
      console.error('Erro ao remover da wishlist:', error);
      throw error;
    }
  },

  // Verificar se lata está na wishlist
  async isInWishlist(userId: string, canId: string): Promise<boolean> {
    try {
      const docSnap = await getDoc(doc(db, `users/${userId}/wishlist`, canId));
      return docSnap.exists();
    } catch (error) {
      console.error('Erro ao verificar wishlist:', error);
      throw error;
    }
  },

  // Contar itens na wishlist
  async getWishlistCount(userId: string): Promise<number> {
    try {
      const wishlistRef = collection(db, `users/${userId}/wishlist`);
      const querySnapshot = await getDocs(wishlistRef);
      return querySnapshot.size;
    } catch (error) {
      console.error('Erro ao contar wishlist:', error);
      throw error;
    }
  },
};
