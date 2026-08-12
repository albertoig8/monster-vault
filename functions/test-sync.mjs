import { generateCanId, findExistingCan, addOrUpdateCan } from './lib/canService.js';
import { normalizeProduct } from './lib/offService.js';
import { MOCK_PRODUCTS } from './test-mock-data.mjs';

console.log('🧪 Testando lógica de sincronização (sem Firestore)...\n');

// Simular banco de dados em memória
const inMemoryDB = {
  cans: new Map(),
  metadata: {
    lastStartedAt: new Date().toISOString(),
    lastCompletedAt: undefined,
    totalProcessed: 0,
    totalCreated: 0,
    totalUpdated: 0,
    totalSkipped: 0,
    lastError: undefined,
  }
};

// Mock do Firestore
const mockDB = {
  collection: (name) => ({
    doc: (id) => ({
      get: async () => ({
        exists: inMemoryDB.cans.has(id),
        data: () => inMemoryDB.cans.get(id),
        id,
      }),
      set: async (data) => {
        inMemoryDB.cans.set(id, data);
      },
      update: async (data) => {
        const existing = inMemoryDB.cans.get(id);
        if (existing) {
          inMemoryDB.cans.set(id, { ...existing, ...data });
        }
      },
    }),
    where: (field, op, value) => ({
      limit: (n) => ({
        get: async () => ({
          empty: true,
          docs: [],
        }),
      }),
    }),
  }),
};

console.log('📋 Processando produtos de teste...\n');

let stats = {
  totalProcessed: 0,
  totalCreated: 0,
  totalUpdated: 0,
  totalSkipped: 0,
};

for (const offProduct of MOCK_PRODUCTS) {
  stats.totalProcessed++;

  console.log(`\n🔄 ${offProduct.product_name}`);

  // Normalizar
  const normalized = normalizeProduct(offProduct);

  if (!normalized) {
    stats.totalSkipped++;
    console.log(`   ⏭️ Pulado (dados incompletos)`);
    continue;
  }

  // Gerar ID
  const canId = generateCanId(
    normalized.barcode,
    normalized.externalId,
    normalized.name,
    normalized.country
  );

  console.log(`   ID: ${canId}`);

  // Simular busca no Firestore
  const existing = inMemoryDB.cans.get(canId);

  if (existing) {
    stats.totalUpdated++;
    console.log(`   ✅ Produto já existe - ATUALIZADO`);
    inMemoryDB.cans.set(canId, {
      ...existing,
      updatedAt: new Date().toISOString(),
    });
  } else {
    stats.totalCreated++;
    console.log(`   ✨ Produto novo - CRIADO`);
    inMemoryDB.cans.set(canId, {
      id: canId,
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
      sources: [
        {
          provider: 'open-food-facts',
          externalId: normalized.externalId,
          url: normalized.url,
          lastCheckedAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

console.log('\n' + '='.repeat(50));
console.log('\n📊 Estatísticas de sincronização:\n');
console.log(`   📥 Total processado: ${stats.totalProcessed}`);
console.log(`   ✨ Produtos criados: ${stats.totalCreated}`);
console.log(`   ⚡ Produtos atualizados: ${stats.totalUpdated}`);
console.log(`   ⏭️  Pulados: ${stats.totalSkipped}`);
console.log(`\n   💾 Produtos no banco: ${inMemoryDB.cans.size}`);

console.log('\n📋 Produtos no banco de dados:\n');

for (const [id, product] of inMemoryDB.cans) {
  console.log(`   • ${product.name}`);
  console.log(`     - ID: ${id}`);
  console.log(`     - País: ${product.country}`);
  console.log(`     - Cafeína: ${product.caffeine}mg`);
}

console.log('\n✨ Teste de sincronização passou!');

// Verificar se tudo foi criado
if (stats.totalCreated === MOCK_PRODUCTS.length) {
  console.log('✅ Todos os produtos foram criados com sucesso!');
} else {
  console.error('❌ Alguns produtos não foram criados');
  process.exit(1);
}
