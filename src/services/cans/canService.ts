import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { MonsterCan } from '../../types';

export interface CanFilter {
  countries?: string[];
  flavors?: string[];
  sizes?: string[];
  years?: number[];
  discontinued?: boolean;
  verified?: boolean;
  categories?: string[];
}

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

  // Buscar latas por nome, flavor, país ou marca
  async searchCans(searchTerm: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      const lowerSearchTerm = searchTerm.toLowerCase();

      return cans.filter((can) => {
        const name = can.name?.toLowerCase() || '';
        const flavor = can.flavor?.toLowerCase() || '';
        const country = can.country?.toLowerCase() || '';
        const brand = can.brand?.toLowerCase() || '';
        const description = can.description?.toLowerCase() || '';

        return (
          name.includes(lowerSearchTerm) ||
          flavor.includes(lowerSearchTerm) ||
          country.includes(lowerSearchTerm) ||
          brand.includes(lowerSearchTerm) ||
          description.includes(lowerSearchTerm)
        );
      });
    } catch (error) {
      console.error('Erro ao buscar latas:', error);
      throw error;
    }
  },

  // Filtrar latas com múltiplos critérios
  async filterCans(filter: CanFilter): Promise<MonsterCan[]> {
    try {
      let cans = await this.getAllCans();

      if (filter.countries && filter.countries.length > 0) {
        cans = cans.filter((can) => filter.countries!.includes(can.country || ''));
      }

      if (filter.flavors && filter.flavors.length > 0) {
        cans = cans.filter((can) => filter.flavors!.includes(can.flavor || ''));
      }

      if (filter.sizes && filter.sizes.length > 0) {
        cans = cans.filter((can) => filter.sizes!.includes(can.size || ''));
      }

      if (filter.years && filter.years.length > 0) {
        cans = cans.filter((can) => filter.years!.includes(can.releaseYear || 0));
      }

      if (filter.categories && filter.categories.length > 0) {
        cans = cans.filter((can) => filter.categories!.includes(can.category || ''));
      }

      if (filter.discontinued !== undefined) {
        cans = cans.filter((can) => can.discontinued === filter.discontinued);
      }

      if (filter.verified !== undefined) {
        cans = cans.filter((can) => can.verified === filter.verified);
      }

      return cans;
    } catch (error) {
      console.error('Erro ao filtrar latas:', error);
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

  // Filtrar latas por categoria
  async getCansByCategory(category: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => can.category === category);
    } catch (error) {
      console.error('Erro ao filtrar latas por categoria:', error);
      throw error;
    }
  },

  // Filtrar latas por sabor
  async getCansByFlavor(flavor: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => can.flavor === flavor);
    } catch (error) {
      console.error('Erro ao filtrar latas por sabor:', error);
      throw error;
    }
  },

  // Filtrar latas por tamanho
  async getCansBySize(size: string): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => can.size === size);
    } catch (error) {
      console.error('Erro ao filtrar latas por tamanho:', error);
      throw error;
    }
  },

  // Filtrar latas por ano de lançamento
  async getCansByYear(year: number): Promise<MonsterCan[]> {
    try {
      const cans = await this.getAllCans();
      return cans.filter((can) => can.releaseYear === year);
    } catch (error) {
      console.error('Erro ao filtrar latas por ano:', error);
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

  // Obter todos os tamanhos disponíveis
  async getSizes(): Promise<string[]> {
    try {
      const cans = await this.getAllCans();
      const sizes = new Set(
        cans.map((can) => can.size).filter((s) => s !== undefined) as string[]
      );
      return Array.from(sizes).sort();
    } catch (error) {
      console.error('Erro ao buscar tamanhos:', error);
      throw error;
    }
  },

  // Obter todos os anos de lançamento disponíveis
  async getYears(): Promise<number[]> {
    try {
      const cans = await this.getAllCans();
      const years = new Set(
        cans.map((can) => can.releaseYear).filter((y) => y !== undefined) as number[]
      );
      return Array.from(years).sort().reverse(); // Mais recentes primeiro
    } catch (error) {
      console.error('Erro ao buscar anos:', error);
      throw error;
    }
  },

  // Obter todas as categorias disponíveis
  async getCategories(): Promise<string[]> {
    try {
      const cans = await this.getAllCans();
      const categories = new Set(
        cans.map((can) => can.category).filter((c) => c !== undefined) as string[]
      );
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  // Obter estatísticas do catálogo
  async getCatalogStats() {
    try {
      const cans = await this.getAllCans();
      return {
        total: cans.length,
        active: cans.filter((can) => !can.discontinued).length,
        discontinued: cans.filter((can) => can.discontinued).length,
        verified: cans.filter((can) => can.verified).length,
        countries: new Set(cans.map((can) => can.country).filter((c) => c)).size,
        flavors: new Set(cans.map((can) => can.flavor).filter((f) => f)).size,
        categories: new Set(cans.map((can) => can.category).filter((c) => c)).size,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do catálogo:', error);
      throw error;
    }
  },
};
