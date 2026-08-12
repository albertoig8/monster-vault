#!/usr/bin/env node

/**
 * Script para popular o Firestore com dados de exemplo
 * 
 * Uso: node scripts/seedFirestore.js
 * 
 * Antes de rodar, você precisa:
 * 1. Ir em Firebase Console -> Project Settings -> Service Accounts
 * 2. Clicar em "Generate New Private Key"
 * 3. Salvar o arquivo JSON como `serviceAccountKey.json` na raiz do projeto
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Verificar se arquivo de credenciais existe
const credentialsPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(credentialsPath)) {
  console.error('❌ Erro: Arquivo serviceAccountKey.json não encontrado!');
  console.error('\nPara gerar as credenciais:');
  console.error('1. Acesse: https://console.firebase.google.com/');
  console.error('2. Selecione seu projeto: monster-vault-4a4c8');
  console.error('3. Vá em Project Settings (⚙️) -> Service Accounts');
  console.error('4. Clique em "Generate New Private Key"');
  console.error('5. Salve o arquivo como: serviceAccountKey.json');
  console.error('6. Execute este script novamente\n');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Dados de exemplo
const sampleCans = [
  {
    id: 'monster-ultra-violet',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2021-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2021-01-01')),
  },
  {
    id: 'monster-lo-carb',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2005-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2005-01-01')),
  },
  {
    id: 'monster-mango-loco',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2019-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2019-01-01')),
  },
  {
    id: 'monster-khaos',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2008-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2008-01-01')),
  },
  {
    id: 'monster-nitro',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
  },
  {
    id: 'monster-aussie',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
  },
  {
    id: 'monster-maxx',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
  },
  {
    id: 'monster-java-irish',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2015-01-01')),
  },
  {
    id: 'monster-pipeline-punch',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2012-01-01')),
  },
  {
    id: 'monster-rehab',
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
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2010-01-01')),
  },
];

async function seedFirestore() {
  console.log('🚀 Iniciando seed do Firestore...\n');

  try {
    const cansCollection = db.collection('cans');
    let created = 0;
    let updated = 0;

    for (const can of sampleCans) {
      try {
        const docRef = cansCollection.doc(can.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          await docRef.update(can);
          console.log(`✏️  Atualizado: ${can.name}`);
          updated++;
        } else {
          await docRef.set(can);
          console.log(`✅ Criado: ${can.name}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${can.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Resultados:`);
    console.log(`  ✅ Criados: ${created}`);
    console.log(`  ✏️  Atualizados: ${updated}`);
    console.log(`  📦 Total: ${created + updated}`);
    console.log('='.repeat(50));

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('🌐 Acesse: http://localhost:5173/catalog');

    await admin.app().delete();
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seedFirestore();
