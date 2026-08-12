import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { CatalogMetadata } from '../../types';

const METADATA_DOC_ID = 'sync';
const METADATA_COLLECTION = 'catalogMetadata';

export const catalogMetadataService = {
  /**
   * Obter metadados atuais de sincronização
   */
  async getMetadata(): Promise<CatalogMetadata> {
    try {
      const docSnap = await getDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID));

      if (docSnap.exists()) {
        return docSnap.data() as CatalogMetadata;
      }

      // Retornar metadados vazios se não existem
      return {
        lastStartedAt: undefined,
        lastCompletedAt: undefined,
        lastSuccessfulAt: undefined,
        totalProcessed: 0,
        totalCreated: 0,
        totalUpdated: 0,
        totalSkipped: 0,
        lastError: undefined,
      };
    } catch (error) {
      console.error('Erro ao buscar metadados do catálogo:', error);
      throw error;
    }
  },

  /**
   * Iniciar sincronização (registra quando começou)
   */
  async startSync(): Promise<void> {
    try {
      const metadata = await this.getMetadata();

      await updateDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID), {
        lastStartedAt: new Date(),
        // Preserve outros campos
        lastCompletedAt: metadata.lastCompletedAt,
        lastSuccessfulAt: metadata.lastSuccessfulAt,
        totalProcessed: metadata.totalProcessed || 0,
        totalCreated: metadata.totalCreated || 0,
        totalUpdated: metadata.totalUpdated || 0,
        totalSkipped: metadata.totalSkipped || 0,
        lastError: metadata.lastError,
      });
    } catch (error) {
      // Se o documento não existe, criar novo
      if ((error as any).code === 'not-found') {
        await setDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID), {
          lastStartedAt: new Date(),
          lastCompletedAt: undefined,
          lastSuccessfulAt: undefined,
          totalProcessed: 0,
          totalCreated: 0,
          totalUpdated: 0,
          totalSkipped: 0,
          lastError: undefined,
        });
      } else {
        console.error('Erro ao iniciar sincronização:', error);
        throw error;
      }
    }
  },

  /**
   * Completar sincronização (registra sucesso e estatísticas)
   */
  async completeSync(stats: {
    totalProcessed: number;
    totalCreated: number;
    totalUpdated: number;
    totalSkipped: number;
  }): Promise<void> {
    try {
      await updateDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID), {
        lastCompletedAt: new Date(),
        lastSuccessfulAt: new Date(),
        totalProcessed: stats.totalProcessed,
        totalCreated: stats.totalCreated,
        totalUpdated: stats.totalUpdated,
        totalSkipped: stats.totalSkipped,
        lastError: undefined, // Limpar erro anterior
      });
    } catch (error) {
      console.error('Erro ao completar sincronização:', error);
      throw error;
    }
  },

  /**
   * Registrar erro de sincronização
   */
  async recordError(error: string): Promise<void> {
    try {
      const metadata = await this.getMetadata();

      await updateDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID), {
        lastError: error,
        lastCompletedAt: new Date(),
        // Preserve successful info se existir
        lastSuccessfulAt: metadata.lastSuccessfulAt,
        totalProcessed: metadata.totalProcessed || 0,
        totalCreated: metadata.totalCreated || 0,
        totalUpdated: metadata.totalUpdated || 0,
        totalSkipped: metadata.totalSkipped || 0,
      });
    } catch (error) {
      console.error('Erro ao registrar erro de sincronização:', error);
      throw error;
    }
  },

  /**
   * Obter informação formatada para exibição
   */
  async getDisplayInfo(): Promise<string> {
    try {
      const metadata = await this.getMetadata();

      if (!metadata.lastSuccessfulAt) {
        return 'Sincronização nunca executada';
      }

      const date = metadata.lastSuccessfulAt;
      if (typeof date === 'object' && 'toDate' in date) {
        const jsDate = date.toDate?.() || new Date(date);
        return `Catálogo atualizado: ${jsDate.toLocaleDateString('pt-BR')} às ${jsDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }

      if (date instanceof Date) {
        return `Catálogo atualizado: ${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }

      return 'Catálogo atualizado';
    } catch (error) {
      console.error('Erro ao obter informações de sincronização:', error);
      return 'Status desconhecido';
    }
  },

  /**
   * Obter informação de último sucesso
   */
  async getLastSuccessfulDate(): Promise<Date | null> {
    try {
      const metadata = await this.getMetadata();

      if (!metadata.lastSuccessfulAt) {
        return null;
      }

      if (typeof metadata.lastSuccessfulAt === 'object' && 'toDate' in metadata.lastSuccessfulAt) {
        return metadata.lastSuccessfulAt.toDate?.() || null;
      }

      if (metadata.lastSuccessfulAt instanceof Date) {
        return metadata.lastSuccessfulAt;
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter data de sucesso:', error);
      return null;
    }
  },

  /**
   * Resettear metadados (útil para testes)
   */
  async reset(): Promise<void> {
    try {
      await setDoc(doc(db, METADATA_COLLECTION, METADATA_DOC_ID), {
        lastStartedAt: undefined,
        lastCompletedAt: undefined,
        lastSuccessfulAt: undefined,
        totalProcessed: 0,
        totalCreated: 0,
        totalUpdated: 0,
        totalSkipped: 0,
        lastError: undefined,
      });
    } catch (error) {
      console.error('Erro ao resetar metadados:', error);
      throw error;
    }
  },
};
