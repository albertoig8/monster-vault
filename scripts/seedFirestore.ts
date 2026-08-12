import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

// Dados de exemplo
const sampleCans = [
  {
    id: '5000112157646',
    brand: 'Monster Energy',
    name: 'Monster Energy Ultra Violet',
    flavor: 'Grape',
    description: 'Monster Energy Ultra Violet - Bebida energética com sabor uva',
    category: 'Regular',
    country: 'USA',
    size: '473ml',
    barcode: '5000112157646',
    imageUrl:
      'https://images.unsplash.com/photo-1554866585-f5f1f9b2a17f?w=400&h=500&fit=crop',
    releaseYear: 2020,
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    verified: true,
    sources: [
      {
        provider: 'manual',
        lastCheckedAt: Timestamp.now().toDate().toISOString(),
      },
    ],
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  },
  {
    id: '5000112157647',
    brand: 'Monster Energy',
    name: 'Monster Energy Absolutely Zero',
    flavor: 'Original',
    description: 'Monster Energy Absolutely Zero - Zero açúcar, zero calorias',
    category: 'Zero Sugar',
    country: 'USA',
    size: '473ml',
    barcode: '5000112157647',
    imageUrl:
      'https://images.unsplash.com/photo-1554867700-e2ea0a109b16?w=400&h=500&fit=crop',
    releaseYear: 2015,
    caffeine: 160,
    sugar: 0,
    discontinued: false,
    verified: true,
    sources: [
      {
        provider: 'manual',
        lastCheckedAt: Timestamp.now().toDate().toISOString(),
      },
    ],
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  },
  {
    id: '5000112157648',
    brand: 'Monster Energy',
    name: 'Monster Energy Mango Loco',
    flavor: 'Mango',
    description: 'Monster Energy Mango Loco - Sabor tropical de manga',
    category: 'Flavor',
    country: 'Brazil',
    size: '473ml',
    barcode: '5000112157648',
    imageUrl:
      'https://images.unsplash.com/photo-1567359781514-a92e14f6c6ab?w=400&h=500&fit=crop',
    releaseYear: 2018,
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    verified: true,
    sources: [
      {
        provider: 'manual',
        lastCheckedAt: Timestamp.now().toDate().toISOString(),
      },
    ],
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  },
  {
    id: '5000112157649',
    brand: 'Monster Energy',
    name: 'Monster Energy Rehab Tea + Lemonade',
    flavor: 'Tea + Lemonade',
    description: 'Monster Energy Rehab - Chá e limão',
    category: 'Rehab',
    country: 'UK',
    size: '500ml',
    barcode: '5000112157649',
    imageUrl:
      'https://images.unsplash.com/photo-1599599810694-a5de1b3a6ba0?w=400&h=500&fit=crop',
    releaseYear: 2012,
    caffeine: 80,
    sugar: 27,
    discontinued: false,
    verified: true,
    sources: [
      {
        provider: 'manual',
        lastCheckedAt: Timestamp.now().toDate().toISOString(),
      },
    ],
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  },
  {
    id: '5000112157650',
    brand: 'Monster Energy',
    name: 'Monster Energy Japan',
    flavor: 'Original',
    description: 'Monster Energy Japan Edition - Edição exclusiva japonesa',
    category: 'Regular',
    country: 'Japan',
    size: '250ml',
    barcode: '5000112157650',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=500&fit=crop',
    releaseYear: 2015,
    caffeine: 80,
    sugar: 27,
    discontinued: false,
    edition: 'Japan Limited',
    verified: true,
    sources: [
      {
        provider: 'manual',
        lastCheckedAt: Timestamp.now().toDate().toISOString(),
      },
    ],
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  },
];

// Metadados de sincronização
const catalogMetadata = {
  lastStartedAt: Timestamp.now().toDate().toISOString(),
  lastCompletedAt: Timestamp.now().toDate().toISOString(),
  lastSuccessfulAt: Timestamp.now().toDate().toISOString(),
  totalProcessed: 5,
  totalCreated: 5,
  totalUpdated: 0,
  totalSkipped: 0,
  lastError: undefined,
};

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de dados...\n');

    // Adicionar latas
    console.log('📥 Adicionando latas ao catálogo...');
    for (const can of sampleCans) {
      await db.collection('cans').doc(can.id).set(can);
      console.log(`   ✅ ${can.name}`);
    }

    // Adicionar metadados
    console.log('\n📊 Adicionando metadados de sincronização...');
    await db.collection('catalogMetadata').doc('sync').set(catalogMetadata);
    console.log('   ✅ Metadados adicionados');

    console.log('\n✨ Seed concluído com sucesso!');
    console.log(`   📦 ${sampleCans.length} latas adicionadas`);
    console.log('   🎯 Agora você pode acessar o catálogo e ver os dados!');
  } catch (error) {
    console.error('❌ Erro ao fazer seed dos dados:', error);
    process.exit(1);
  }
}

// Executar seed
seedDatabase().then(() => {
  console.log('\n✅ Desconectando...');
  process.exit(0);
});
