#!/usr/bin/env node

/**
 * Script para popular o Firestore com dados de exemplo
 *
 * Uso: npm run seed
 *
 * Requisitos:
 * 1. Gerar uma chave do Firebase em Project Settings -> Service Accounts
 * 2. Salvar em serviceAccountKey.json na raiz do projeto
 *    ou exportar FIREBASE_SERVICE_ACCOUNT_JSON com o conteúdo do JSON
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function resolveServiceAccount() {
  const credentialsPath = path.join(__dirname, '..', 'serviceAccountKey.json');

  if (fs.existsSync(credentialsPath)) {
    return JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  return null;
}

const serviceAccount = resolveServiceAccount();

if (!serviceAccount) {
  console.error('❌ Arquivo serviceAccountKey.json não encontrado e FIREBASE_SERVICE_ACCOUNT_JSON não foi informado.');
  console.error('\nPara gerar as credenciais:');
  console.error('1. Acesse https://console.firebase.google.com/');
  console.error('2. Selecione o projeto do Monster Vault');
  console.error('3. Vá em Project Settings -> Service Accounts');
  console.error('4. Clique em "Generate New Private Key"');
  console.error('5. Salve o arquivo como serviceAccountKey.json na raiz do projeto');
  console.error('6. Ou exporte FIREBASE_SERVICE_ACCOUNT_JSON com o conteúdo do JSON');
  console.error('7. Execute: npm run seed\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const sampleCans = [
  {
    id: 'monster-ultra-violet',
    brand: 'Monster Energy',
    name: 'Monster Ultra Violet',
    flavor: 'Grape',
    description: 'Sabor de uva refrescante',
    category: 'Ultra',
    size: '473ml',
    country: 'USA',
    releaseYear: 2021,
    imageUrl: 'https://via.placeholder.com/200x400?text=Ultra+Violet',
    barcode: '5060567000022',
    caffeine: 80,
    sugar: 0,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2021-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2021-01-01')),
  },
  {
    id: 'monster-lo-carb',
    brand: 'Monster Energy',
    name: 'Monster Lo-Carb',
    flavor: 'Original',
    description: 'Monster clássico com menos carboidratos',
    category: 'Lo-Carb',
    size: '473ml',
    country: 'USA',
    releaseYear: 2005,
    imageUrl: 'https://via.placeholder.com/200x400?text=Lo-Carb',
    barcode: '5060567000015',
    caffeine: 160,
    sugar: 2,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2005-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2005-01-01')),
  },
  {
    id: 'monster-mango-loco',
    brand: 'Monster Energy',
    name: 'Monster Mango Loco',
    flavor: 'Mango',
    description: 'Sabor tropical de manga',
    category: 'Regular',
    size: '473ml',
    country: 'Brazil',
    releaseYear: 2019,
    imageUrl: 'https://via.placeholder.com/200x400?text=Mango+Loco',
    barcode: '5060567000054',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2019-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2019-01-01')),
  },
  {
    id: 'monster-khaos',
    brand: 'Monster Energy',
    name: 'Monster Khaos',
    flavor: 'Tropical Mix',
    description: 'Mistura tropical de frutas',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2008,
    imageUrl: 'https://via.placeholder.com/200x400?text=Khaos',
    barcode: '5060567000023',
    caffeine: 160,
    sugar: 54,
    discontinued: true,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2008-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2008-01-01')),
  },
  {
    id: 'monster-nitro',
    brand: 'Monster Energy',
    name: 'Monster Nitro',
    flavor: 'Tropical',
    description: 'Monster com nitrogênio',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2012,
    imageUrl: 'https://via.placeholder.com/200x400?text=Nitro',
    barcode: '5060567000030',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
  },
  {
    id: 'monster-aussie',
    brand: 'Monster Energy',
    name: 'Monster Aussie',
    flavor: 'Lemonade',
    description: 'Bebida energética com limão',
    category: 'Regular',
    size: '473ml',
    country: 'Australia',
    releaseYear: 2015,
    imageUrl: 'https://via.placeholder.com/200x400?text=Aussie',
    barcode: '5060567000042',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
  },
  {
    id: 'monster-maxx',
    brand: 'Monster Energy',
    name: 'Monster Maxx',
    flavor: 'Tropical',
    description: 'Monster com potência máxima',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2010,
    imageUrl: 'https://via.placeholder.com/200x400?text=Maxx',
    barcode: '5060567000031',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
  },
  {
    id: 'monster-java-irish',
    brand: 'Monster Energy',
    name: 'Monster Java Irish',
    flavor: 'Coffee',
    description: 'Bebida energética com café irlandês',
    category: 'Java',
    size: '443ml',
    country: 'USA',
    releaseYear: 2015,
    imageUrl: 'https://via.placeholder.com/200x400?text=Java+Irish',
    barcode: '5060567000067',
    caffeine: 188,
    sugar: 34,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
  },
  {
    id: 'monster-pipeline-punch',
    brand: 'Monster Energy',
    name: 'Monster Pipeline Punch',
    flavor: 'Tropical Punch',
    description: 'Bebida com sabor tropical intenso',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2012,
    imageUrl: 'https://via.placeholder.com/200x400?text=Pipeline+Punch',
    barcode: '5060567000044',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
  },
  {
    id: 'monster-rehab',
    brand: 'Monster Energy',
    name: 'Monster Rehab',
    flavor: 'Tea Lemonade',
    description: 'Bebida energética com chá de limonada',
    category: 'Rehab',
    size: '473ml',
    country: 'USA',
    releaseYear: 2010,
    imageUrl: 'https://via.placeholder.com/200x400?text=Rehab',
    barcode: '5060567000035',
    caffeine: 80,
    sugar: 21,
    discontinued: false,
    edition: null,
    verified: true,
    sources: [{ provider: 'manual', lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date('2026-08-12')) }],
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
  },
];

async function seedFirestore() {
  console.log('🚀 Iniciando seed do Firestore...\n');

  try {
    const batch = db.batch();
    let count = 0;

    sampleCans.forEach((can) => {
      const docRef = db.collection('cans').doc(can.id);
      batch.set(docRef, can);
      count += 1;
    });

    await batch.commit();

    await db.collection('catalogMetadata').doc('sync').set(
      {
        lastStartedAt: new Date(),
        lastCompletedAt: new Date(),
        lastSuccessfulAt: new Date(),
        totalProcessed: count,
        totalCreated: count,
        totalUpdated: 0,
        totalSkipped: 0,
        lastError: null,
      },
      { merge: true }
    );

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Resultados:`);
    console.log(`  ✅ Documentos escritos: ${count}`);
    console.log('  📦 Coleção: cans');
    console.log('  📚 Metadados: catalogMetadata/sync');
    console.log('='.repeat(50));

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('🌐 Acesse: http://localhost:5173/catalog');
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

seedFirestore();
