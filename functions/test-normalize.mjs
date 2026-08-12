import { normalizeProduct } from './lib/offService.js';
import { MOCK_PRODUCTS } from './test-mock-data.mjs';

console.log('🧪 Testando normalização com dados mock...\n');

console.log(`📥 Usando ${MOCK_PRODUCTS.length} produtos de teste\n`);

let successCount = 0;
let skipCount = 0;

for (const product of MOCK_PRODUCTS) {
  console.log(`\n🔄 Processando: ${product.product_name}`);
  console.log(`   Código: ${product.code}`);
  console.log(`   País: ${product.countries}`);

  const normalized = normalizeProduct(product);

  if (normalized) {
    successCount++;
    console.log(`   ✅ Normalizado com sucesso`);
    console.log(`      ID: ${normalized.barcode || normalized.externalId}`);
    console.log(`      Cafeína: ${normalized.caffeine}mg`);
    console.log(`      Tamanho: ${normalized.size}`);
  } else {
    skipCount++;
    console.log(`   ⏭️ Pulado (dados incompletos)`);
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Resultados:`);
console.log(`   ✅ Normalizados: ${successCount}`);
console.log(`   ⏭️ Pulados: ${skipCount}`);
console.log(`   Total: ${MOCK_PRODUCTS.length}\n`);

if (successCount > 0) {
  console.log('✨ Teste de normalização passou!');
  
  // Mostrar exemplo completo
  console.log('\n📋 Exemplo de produto normalizado:\n');
  const example = normalizeProduct(MOCK_PRODUCTS[0]);
  console.log(JSON.stringify(example, null, 2));
} else {
  console.error('❌ Nenhum produto foi normalizado com sucesso');
  process.exit(1);
}
