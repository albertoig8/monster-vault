/**
 * Monster Vault - Sample Seed Data
 * 
 * Este arquivo contém dados de exemplo para popular o Firestore.
 * Use este arquivo como referência para adicionar dados manualmente
 * ou como base para criar um script de seed automático.
 * 
 * Para usar este script, você pode:
 * 1. Copiar os dados manualmente para o Firestore Console
 * 2. Ou criar um Cloud Function que execute este seed
 * 3. Ou usar um script Node.js com firebase-admin
 */

import type { MonsterCan } from './src/types/index';

export const sampleCans: MonsterCan[] = [
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2005-01-01'),
    updatedAt: new Date('2005-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2019-01-01'),
    updatedAt: new Date('2019-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2008-01-01'),
    updatedAt: new Date('2008-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2012-01-01'),
    updatedAt: new Date('2012-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2015-01-01'),
    updatedAt: new Date('2015-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2010-01-01'),
    updatedAt: new Date('2010-01-01'),
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
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2015-01-01'),
    updatedAt: new Date('2015-01-01'),
  },
  {
    id: 'monster-mixxd',
    brand: 'Monster Energy',
    name: 'Monster Mixxd',
    flavor: 'Berry Lemonade',
    description: 'Mistura de frutas vermelhas com limão',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2018,
    imageUrl: 'https://via.placeholder.com/200x400?text=Mixxd',
    barcode: '5060567000048',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-01'),
  },
  {
    id: 'monster-pipeline',
    brand: 'Monster Energy',
    name: 'Monster Pipeline Punch',
    flavor: 'Tropical Punch',
    description: 'Soco refrescante tropical',
    category: 'Regular',
    size: '473ml',
    country: 'USA',
    releaseYear: 2002,
    imageUrl: 'https://via.placeholder.com/200x400?text=Pipeline+Punch',
    barcode: '5060567000009',
    caffeine: 160,
    sugar: 54,
    discontinued: false,
    edition: undefined,
    verified: true,
    sources: [
      { provider: 'manual', lastCheckedAt: new Date('2026-08-12') },
    ],
    createdAt: new Date('2002-01-01'),
    updatedAt: new Date('2002-01-01'),
  },
];

/**
 * Para usar este arquivo com Firebase Admin SDK:
 * 
 * import admin from 'firebase-admin';
 * import { sampleCans } from './seedData';
 * 
 * const db = admin.firestore();
 * 
 * async function seedDatabase() {
 *   const batch = db.batch();
 *   
 *   for (const can of sampleCans) {
 *     const docRef = db.collection('cans').doc(can.id);
 *     batch.set(docRef, {
 *       ...can,
 *       createdAt: admin.firestore.Timestamp.fromDate(can.createdAt as Date),
 *       updatedAt: admin.firestore.Timestamp.fromDate(can.updatedAt as Date),
 *     });
 *   }
 *   
 *   await batch.commit();
 *   console.log('Seed data added successfully!');
 * }
 * 
 * seedDatabase().catch(console.error);
 */

export default sampleCans;
