import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { CollectionItem, CollectionStats, MonsterCan } from '../../types';
import { canService } from '../cans/canService';

export const collectionService = {
  // Obter coleção do usuário com dados das latas
  async getUserCollection(userId: string): Promise<(CollectionItem & { can: MonsterCan })[]> {
    try {
      const collectionRef = collection(db, `users/${userId}/collection`);
      const querySnapshot = await getDocs(collectionRef);

      const items = [];
      for (const docSnap of querySnapshot.docs) {
        const canId = docSnap.id;
        const can = await canService.getCanById(canId);
        if (can) {
          items.push({
            ...(docSnap.data() as CollectionItem),
            can,
          });
        }
      }

      return items;
    } catch (error) {
      console.error('Erro ao buscar coleção:', error);
      throw error;
    }
  },

  // Adicionar lata à coleção
  async addToCollection(
    userId: string,
    canId: string,
    quantity: number = 1,
    notes: string = ''
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${userId}/collection`, canId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Se já existe, incrementar quantidade
        await updateDoc(docRef, {
          quantity: increment(quantity),
        });
      } else {
        // Se não existe, criar novo documento
        await setDoc(docRef, {
          canId,
          quantity,
          addedAt: Timestamp.now(),
          notes,
        } as CollectionItem);
      }
    } catch (error) {
      console.error('Erro ao adicionar à coleção:', error);
      throw error;
    }
  },

  // Remover lata da coleção
  async removeFromCollection(userId: string, canId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, `users/${userId}/collection`, canId));
    } catch (error) {
      console.error('Erro ao remover da coleção:', error);
      throw error;
    }
  },

  // Atualizar quantidade
  async updateQuantity(userId: string, canId: string, quantity: number): Promise<void> {
    try {
      await updateDoc(doc(db, `users/${userId}/collection`, canId), {
        quantity,
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  },

  // Incrementar quantidade
  async incrementQuantity(userId: string, canId: string, amount: number = 1): Promise<void> {
    try {
      await updateDoc(doc(db, `users/${userId}/collection`, canId), {
        quantity: increment(amount),
      });
    } catch (error) {
      console.error('Erro ao incrementar quantidade:', error);
      throw error;
    }
  },

  // Verificar se lata está na coleção
  async isInCollection(userId: string, canId: string): Promise<boolean> {
    try {
      const docSnap = await getDoc(doc(db, `users/${userId}/collection`, canId));
      return docSnap.exists();
    } catch (error) {
      console.error('Erro ao verificar coleção:', error);
      throw error;
    }
  },

  // Obter quantidade de uma lata
  async getQuantity(userId: string, canId: string): Promise<number> {
    try {
      const docSnap = await getDoc(doc(db, `users/${userId}/collection`, canId));
      if (docSnap.exists()) {
        return (docSnap.data() as CollectionItem).quantity || 0;
      }
      return 0;
    } catch (error) {
      console.error('Erro ao obter quantidade:', error);
      throw error;
    }
  },

  // Obter estatísticas da coleção
  async getCollectionStats(userId: string): Promise<CollectionStats> {
    try {
      const collection = await this.getUserCollection(userId);

      const totalCans = collection.reduce((sum, item) => sum + item.quantity, 0);
      const uniqueCans = collection.length;
      const duplicates = totalCans - uniqueCans;

      const flavors = new Set(collection.map((item) => item.can.flavor).filter(Boolean));
      const countries = new Set(collection.map((item) => item.can.country).filter(Boolean));

      return {
        totalCans,
        uniqueCans,
        duplicates,
        flavors: flavors.size,
        countries: countries.size,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  },

  // Obter latas adicionadas recentemente
  async getRecentlyAdded(userId: string, limit: number = 5): Promise<(CollectionItem & { can: MonsterCan })[]> {
    try {
      const collection = await this.getUserCollection(userId);
      return collection.sort((a, b) => {
        const aTime = a.addedAt?.toMillis?.() || 0;
        const bTime = b.addedAt?.toMillis?.() || 0;
        return bTime - aTime;
      }).slice(0, limit);
    } catch (error) {
      console.error('Erro ao obter adições recentes:', error);
      throw error;
    }
  },
};
