#!/bin/bash

# Monster Vault - Cloud Functions Setup Script

set -e

echo "🚀 Monster Vault - Cloud Functions Setup"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js encontrado: $(node --version)${NC}"
echo ""

# Instalar dependências do projeto raiz
echo "📦 Instalando dependências do projeto..."
npm install

echo ""
echo "📦 Instalando dependências das Cloud Functions..."

# Entrar na pasta functions
cd functions

# Instalar dependências
npm install

echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# Build
echo "🔨 Compilando Cloud Functions..."
npm run build

echo -e "${GREEN}✓ Cloud Functions compiladas com sucesso${NC}"
echo ""

# Voltar para raiz
cd ..

echo "=========================================="
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "Próximos passos:"
echo ""
echo "  1. Configure Firebase CLI:"
echo "     ${YELLOW}npm install -g firebase-tools${NC}"
echo "     ${YELLOW}firebase login${NC}"
echo ""
echo "  2. Para desenvolvimento local:"
echo "     ${YELLOW}cd functions${NC}"
echo "     ${YELLOW}npm run serve${NC}"
echo ""
echo "  3. Para deploy em produção:"
echo "     ${YELLOW}firebase deploy${NC}"
echo ""
echo "  4. Ver logs:"
echo "     ${YELLOW}firebase functions:log${NC}"
echo ""
