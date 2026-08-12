#!/usr/bin/env node

/**
 * Script para testar Cloud Functions localmente
 * 
 * Uso:
 *   npm run test:sync       # Testar lógica de sincronização
 *   npm run test:off        # Testar integração com Open Food Facts
 */

import axios from 'axios';
import { 
  searchMonsterProducts, 
  normalizeProduct, 
  type OpenFoodFactsProduct 
} from '../src/offService.js';

async function testOffIntegration() {
  console.log('🧪 Testando integração com Open Food Facts...\n');

  try {
    console.log('📥 Buscando produtos Monster Energy...');
    const products = await searchMonsterProducts(1, 5); // Apenas 5 para teste

    if (!products || products.length === 0) {
      console.error('❌ Nenhum produto encontrado!');
      return;
    }

    console.log(`✅ Encontrados ${products.length} produtos\n`);

    // Testar normalização
    console.log('🔄 Testando normalização de dados...\n');

    const normalized = products
      .map((p) => {
        try {
          return normalizeProduct(p);
        } catch (error) {
          console.error(`❌ Erro ao normalizar ${p.code}:`, error);
          return null;
        }
      })
      .filter(Boolean);

    console.log(`✅ Normalizados com sucesso: ${normalized.length}/${products.length}\n`);

    // Mostrar exemplos
    if (normalized.length > 0) {
      console.log('📋 Exemplo de produto normalizado:\n');
      console.log(JSON.stringify(normalized[0], null, 2));
    }

    console.log('\n✨ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
    process.exit(1);
  }
}

async function testFunctionLocally() {
  console.log('🧪 Testando função localmente...\n');

  try {
    const url = process.env.EMULATOR_URL || 'http://localhost:5001/monster-vault-4a4c8/us-central1/syncCatalog';

    console.log(`📤 Chamando: ${url}`);
    console.log('⏳ Aguardando resposta...\n');

    const response = await axios.post(url, {}, { timeout: 30000 });

    console.log('✅ Resposta recebida:\n');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n✨ Função testada com sucesso!');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Erro ao chamar função:');
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Mensagem: ${error.message}`);
      if (error.response?.data) {
        console.error(`   Dados: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } else {
      console.error('❌ Erro:', error);
    }
    process.exit(1);
  }
}

// Determinar qual teste rodar
const testType = process.argv[2] || 'off';

if (testType === 'off') {
  await testOffIntegration();
} else if (testType === 'function') {
  await testFunctionLocally();
} else {
  console.log('Teste desconhecido. Use "off" ou "function".');
  process.exit(1);
}
