#!/bin/bash

# Script para fazer seed de dados no Firestore

set -e

echo "🌱 Monster Vault - Seed de Dados no Firestore"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI não está instalado${NC}"
    echo "   Execute: npm install -g firebase-tools"
    exit 1
fi

# Verificar se GOOGLE_APPLICATION_CREDENTIALS está configurado
if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    echo -e "${BLUE}💡 Dica: Configure GOOGLE_APPLICATION_CREDENTIALS para usar chave de serviço${NC}"
    echo "   export GOOGLE_APPLICATION_CREDENTIALS=./path/to/serviceAccountKey.json"
    echo ""
fi

echo -e "${BLUE}📦 Instalando dependências necessárias...${NC}"
npm install -g ts-node @types/node --silent

echo -e "${GREEN}✓ Pronto${NC}"
echo ""

echo -e "${BLUE}🌱 Fazendo seed dos dados...${NC}"
echo ""

# Rodar o script de seed
ts-node ./scripts/seedFirestore.ts

echo ""
echo -e "${GREEN}✅ Seed concluído!${NC}"
echo ""
echo "📝 Próximos passos:"
echo "   1. Acesse o app e vá para a página Catálogo"
echo "   2. Clique em 'Sincronizar Agora' para testar"
echo "   3. Novos produtos aparecerão no catálogo"
echo ""
