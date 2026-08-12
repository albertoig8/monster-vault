import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import cors from 'cors';
import { searchMonsterProducts, normalizeProduct } from './offService';
import { findExistingCan, addOrUpdateCan } from './canService';

initializeApp();

const db = getFirestore();

// Configurar CORS
const corsHandler = cors({ origin: true });

interface SyncStats {
  totalProcessed: number;
  totalCreated: number;
  totalUpdated: number;
  totalSkipped: number;
  errors: string[];
}

/**
 * Cloud Function: Sincronizar catálogo com Open Food Facts
 * Acionada manualmente ou por Cloud Scheduler (diariamente)
 */
export const syncCatalog = functions.https.onRequest(async (req, res) => {
  // Aplicar CORS
  await new Promise((resolve, reject) => {
    corsHandler(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });

  // Suportar GET para testes e POST para produção
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'Cloud Function sincCatalog está funcionando!',
      info: 'Use POST para sincronizar',
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const stats: SyncStats = {
    totalProcessed: 0,
    totalCreated: 0,
    totalUpdated: 0,
    totalSkipped: 0,
    errors: [],
  };

  try {
    console.log('Iniciando sincronização do catálogo...');

    // Registrar início da sincronização
    await db.collection('catalogMetadata').doc('sync').update({
      lastStartedAt: new Date().toISOString(),
    });

    // Buscar produtos Monster do Open Food Facts
    let totalPages = 1;
    let currentPage = 1;
    const maxPages = 5; // Limitar a 5 páginas para teste

    while (currentPage <= totalPages && currentPage <= maxPages) {
      console.log(`Buscando página ${currentPage}...`);

      const products = await searchMonsterProducts(currentPage, 100);

      if (products.length === 0) {
        console.log('Nenhum produto encontrado nesta página.');
        break;
      }

      // Processar cada produto
      for (const offProduct of products) {
        try {
          stats.totalProcessed++;

          // Normalizar produto
          const normalized = normalizeProduct(offProduct);

          if (!normalized) {
            stats.totalSkipped++;
            console.log(`Produto skipped (dados incompletos): ${offProduct.code}`);
            continue;
          }

          // Buscar lata existente
          const existing = await findExistingCan(
            db,
            normalized.barcode,
            normalized.externalId,
            normalized.name,
            normalized.country
          );

          // Adicionar ou atualizar
          const source = {
            provider: 'open-food-facts',
            externalId: normalized.externalId,
            url: normalized.url,
            lastCheckedAt: new Date().toISOString(),
          };

          const result = await addOrUpdateCan(
            db,
            {
              brand: normalized.brand,
              name: normalized.name,
              barcode: normalized.barcode,
              country: normalized.country,
              size: normalized.size,
              imageUrl: normalized.imageUrl,
              caffeine: normalized.caffeine,
              description: normalized.description,
              discontinued: false, // Open Food Facts só tem produtos ativos
              verified: false, // Marcar como não verificado inicialmente
              sources: [source],
            },
            existing
          );

          if (result.created) {
            stats.totalCreated++;
            console.log(`Produto criado: ${result.canId}`);
          } else {
            stats.totalUpdated++;
            console.log(`Produto atualizado: ${result.canId}`);
          }
        } catch (error) {
          const errorMsg = `Erro ao processar produto ${offProduct.code}: ${error}`;
          console.error(errorMsg);
          stats.errors.push(errorMsg);
        }
      }

      currentPage++;
    }

    // Registrar conclusão da sincronização
    await db.collection('catalogMetadata').doc('sync').update({
      lastCompletedAt: new Date().toISOString(),
      lastSuccessfulAt: new Date().toISOString(),
      totalProcessed: stats.totalProcessed,
      totalCreated: stats.totalCreated,
      totalUpdated: stats.totalUpdated,
      totalSkipped: stats.totalSkipped,
      lastError: stats.errors.length > 0 ? stats.errors[0] : null,
    });

    console.log('Sincronização concluída:', stats);

    res.status(200).json({
      success: true,
      message: 'Sincronização concluída com sucesso',
      stats,
    });
  } catch (error) {
    console.error('Erro durante sincronização:', error);

    // Registrar erro
    try {
      await db.collection('catalogMetadata').doc('sync').update({
        lastError: String(error),
        lastCompletedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error('Erro ao registrar erro de sincronização:', updateError);
    }

    res.status(500).json({
      success: false,
      message: 'Erro durante sincronização',
      error: String(error),
      stats,
    });
  }
});

/**
 * Cloud Function: Sincronização agendada (diária)
 * Configure no Cloud Scheduler para executar a cada 24h
 */
export const dailySyncSchedule = functions.pubsub.schedule('0 3 * * *').onRun(async () => {
  console.log('Iniciando sincronização agendada...');

  const stats: SyncStats = {
    totalProcessed: 0,
    totalCreated: 0,
    totalUpdated: 0,
    totalSkipped: 0,
    errors: [],
  };

  try {
    // Registrar início
    await db.collection('catalogMetadata').doc('sync').update({
      lastStartedAt: new Date().toISOString(),
    });

    // Buscar e processar produtos (mesma lógica que syncCatalog)
    const products = await searchMonsterProducts(1, 100);

    for (const offProduct of products) {
      try {
        stats.totalProcessed++;

        const normalized = normalizeProduct(offProduct);
        if (!normalized) {
          stats.totalSkipped++;
          continue;
        }

        const existing = await findExistingCan(
          db,
          normalized.barcode,
          normalized.externalId,
          normalized.name,
          normalized.country
        );

        const source = {
          provider: 'open-food-facts',
          externalId: normalized.externalId,
          url: normalized.url,
          lastCheckedAt: new Date().toISOString(),
        };

        const result = await addOrUpdateCan(
          db,
          {
            brand: normalized.brand,
            name: normalized.name,
            barcode: normalized.barcode,
            country: normalized.country,
            size: normalized.size,
            imageUrl: normalized.imageUrl,
            caffeine: normalized.caffeine,
            description: normalized.description,
            discontinued: false,
            verified: false,
            sources: [source],
          },
          existing
        );

        if (result.created) {
          stats.totalCreated++;
        } else {
          stats.totalUpdated++;
        }
      } catch (error) {
        stats.errors.push(String(error));
      }
    }

    // Registrar conclusão
    await db.collection('catalogMetadata').doc('sync').update({
      lastCompletedAt: new Date().toISOString(),
      lastSuccessfulAt: new Date().toISOString(),
      totalProcessed: stats.totalProcessed,
      totalCreated: stats.totalCreated,
      totalUpdated: stats.totalUpdated,
      totalSkipped: stats.totalSkipped,
      lastError: stats.errors.length > 0 ? stats.errors[0] : null,
    });

    console.log('Sincronização agendada concluída:', stats);
  } catch (error) {
    console.error('Erro na sincronização agendada:', error);

    try {
      await db.collection('catalogMetadata').doc('sync').update({
        lastError: String(error),
        lastCompletedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error('Erro ao registrar erro:', updateError);
    }
  }
});
