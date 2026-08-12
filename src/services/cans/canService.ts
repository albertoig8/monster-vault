import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { MonsterCan } from '../../types';

export const canService = {
  // Obter todas as latas
  async getAllCans(): Promise<MonsterCan[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'cans'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as MonsterCan));
    } catch (error) {
      console.error('Erro ao buscar latas:', error);
      throw error;
    }
  },

  // Obter lata por ID
  async getCanById(canId: string): Promise<MonsterCan | null> {
    try {
      const docSnap = await getDoc(doc(db, 'cans', canId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as MonsterCan;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar lata:', error);
      throw error;
    }
  },

  // Buscar latas por nome, flavor ou país
  async searchCans(searchTerm: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      const lowerSearchTerm = searchTerm.toLowerCase();

      return cans.filter((can) => {
        const name = can.name?.toLowerCase() || '';
        const flavor = can.flavor?.toLowerCase() || '';
        const country = can.country?.toLowerCase() || '';

        return (
          name.includes(lowerSearchTerm) ||
          flavor.includes(lowerSearchTerm) ||
          country.includes(lowerSearchTerm)
        );
      });
    } catch (error) {
      console.error('Erro ao buscar latas:', error);
      throw error;
    }
  },

  // Obter latas não descontinuadas
  async getActiveCans(): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => !can.discontinued);
    } catch (error) {
      console.error('Erro ao buscar latas ativas:', error);
      throw error;
    }
  },

  // Filtrar latas por país
  async getCansByCountry(country: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => can.country === country);
    } catch (error) {
      console.error('Erro ao filtrar latas por país:', error);
      throw error;
    }
  },

  // Obter todos os países disponíveis
  async getCountries(): Promise<string[]> {
    try {
      const cans = await this.getAllCans();
      const countries = new Set(
        cans.map((can) => can.country).filter((c) => c !== undefined) as string[]
      );
      return Array.from(countries).sort();
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      throw error;
    }
  },

  // Obter todos os flavors disponíveis
  async getFlavors(): Promise<string[]> {
    try {
      const cans = await this.getAllCans();
      const flavors = new Set(
        cans.map((can) => can.flavor).filter((f) => f !== undefined) as string[]
      );
      return Array.from(flavors).sort();
    } catch (error) {
      console.error('Erro ao buscar flavors:', error);
      throw error;
    }
  },
};
