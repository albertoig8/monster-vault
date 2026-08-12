#!/bin/bash

# Script para rodar todos os testes das Cloud Functions

set -e

echo "🧪 Monster Vault - Cloud Functions Test Suite"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Compilar functions
echo -e "${BLUE}📦 Compilando Cloud Functions...${NC}"
npm run build > /dev/null 2>&1
echo "✅ Compilação concluída"
echo ""

# Teste 1: Normalização
echo -e "${BLUE}🧪 Test 1: Normalização de Produtos${NC}"
echo "Testando extração de dados do Open Food Facts"
echo ""
node test-normalize.mjs
echo ""

# Teste 2: Sincronização
echo -e "${BLUE}🧪 Test 2: Lógica de Sincronização${NC}"
echo "Testando criação/atualização de produtos em memória"
echo ""
node test-sync.mjs
echo ""

echo "=============================================="
echo -e "${GREEN}✅ Todos os testes passaram com sucesso!${NC}"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "  1️⃣  Deploy das Cloud Functions em produção:"
echo "      firebase deploy --only functions"
echo ""
echo "  2️⃣  Configurar Cloud Scheduler para sincronização diária:"
echo "      # Isso será feito automaticamente no primeiro deploy"
echo ""
echo "  3️⃣  Criar interface no frontend para sincronizar:"
echo "      Ver src/services/sync/syncService.ts"
echo ""
echo "  4️⃣  Monitorar sincronizações:"
echo "      firebase functions:log"
echo ""
