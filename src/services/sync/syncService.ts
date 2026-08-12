import { httpsCallable, getFunctions } from 'firebase/functions';

const functions = getFunctions();

export interface SyncStats {
  totalProcessed: number;
  totalCreated: number;
  totalUpdated: number;
  totalSkipped: number;
  errors: string[];
}

export interface SyncResponse {
  success: boolean;
  message: string;
  stats: SyncStats;
}

/**
 * Chamar Cloud Function para sincronizar catálogo com Open Food Facts
 */
export async function triggerCatalogSync(): Promise<SyncResponse> {
  try {
    // Usar a URL da função diretamente (já que implementamos como onRequest)
    const response = await fetch(
      'https://us-central1-<PROJECT_ID>.cloudfunctions.net/syncCatalog',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao sincronizar catálogo:', error);
    throw error;
  }
}

/**
 * Chamar Cloud Function usando HTTP Callable (alternativa mais segura)
 * Nota: Para usar isso, alterar a Cloud Function para usar `onCall` em vez de `onRequest`
 */
export async function triggerCatalogSyncCallable(): Promise<SyncResponse> {
  try {
    const syncFunction = httpsCallable<Record<string, never>, SyncResponse>(
      functions,
      'syncCatalog'
    );
    const result = await syncFunction();
    return result.data;
  } catch (error) {
    console.error('Erro ao sincronizar catálogo:', error);
    throw error;
  }
}
