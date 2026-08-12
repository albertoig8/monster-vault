import('./lib/offService.js').then(async (mod) => {
  console.log('🧪 Testando integração com Open Food Facts...\n');
  try {
    console.log('📥 Buscando produtos Monster Energy (página 1, 3 produtos)...');
    const products = await mod.searchMonsterProducts(1, 3);
    
    if (!products || products.length === 0) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }
    
    console.log(`✅ Encontrados ${products.length} produtos\n`);
    
    console.log('🔄 Normalizando primeiro produto...\n');
    const normalized = mod.normalizeProduct(products[0]);
    
    if (normalized) {
      console.log('✅ Produto normalizado com sucesso:\n');
      console.log(JSON.stringify(normalized, null, 2));
    } else {
      console.log('⏭️ Produto pulado (dados incompletos)');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}).catch(e => console.error('Erro:', e));
