#!/bin/bash

# Teste de Cloud Functions - Monster Vault
# Este script inicia os emuladores do Firebase e testa as Cloud Functions

set -e

echo "🧪 Monster Vault - Cloud Functions Test"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está na pasta correta
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}❌ firebase.json não encontrado. Execute a partir da raiz do projeto.${NC}"
    exit 1
fi

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI não está instalado.${NC}"
    echo "   Execute: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✓ Dependências verificadas${NC}"
echo ""

# Compilar functions
echo -e "${BLUE}📦 Compilando Cloud Functions...${NC}"
cd functions
npm run build > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ Cloud Functions compiladas${NC}"
echo ""

# Iniciar emuladores
echo -e "${BLUE}🚀 Iniciando emuladores do Firebase...${NC}"
echo "   Aguarde 10-15 segundos para os emuladores iniciarem..."
echo ""

firebase emulators:start --only functions,firestore &
EMULATOR_PID=$!

# Aguardar emuladores iniciarem
sleep 15

# Verificar se emuladores estão rodando
if ! kill -0 $EMULATOR_PID 2>/dev/null; then
    echo -e "${RED}❌ Erro ao iniciar emuladores${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Emuladores iniciados (PID: $EMULATOR_PID)${NC}"
echo ""

# Testar função
echo -e "${BLUE}📤 Testando função syncCatalog...${NC}"
echo ""

PROJECT_ID="monster-vault-4a4c8"
REGION="us-central1"
FUNCTION_URL="http://localhost:5001/${PROJECT_ID}/${REGION}/syncCatalog"

echo "URL: $FUNCTION_URL"
echo ""

# Fazer requisição
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)

echo -e "${BLUE}Resposta HTTP: $HTTP_CODE${NC}"
echo ""
echo -e "${BLUE}Corpo da resposta:${NC}"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

echo ""
echo "========================================"

# Parar emuladores
echo -e "${YELLOW}⏹️  Parando emuladores...${NC}"
kill $EMULATOR_PID 2>/dev/null || true
wait $EMULATOR_PID 2>/dev/null || true

echo ""

# Verificar resultado
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Teste concluído com sucesso!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. Deploy em produção: firebase deploy --only functions"
    echo "  2. Criar interface de sincronização no frontend"
    echo ""
else
    echo -e "${RED}❌ Teste falhou (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
