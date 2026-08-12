# Cloud Functions Setup

## Visão Geral

Cloud Functions para sincronização automática do catálogo de Monster Energy com Open Food Facts.

## Arquitetura

```
Open Food Facts API
        ↓
Cloud Function (syncCatalog)
        ↓
Normalizar Dados
        ↓
Identificar Produtos Existentes
        ↓
Criar/Atualizar no Firestore
        ↓
Atualizar catalogMetadata
```

## Instalação Local

### 1. Instalar Dependências

```bash
cd functions
npm install
```

### 2. Configurar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### 3. Build

```bash
npm run build
```

## Desenvolvimento Local

### Emular Functions Localmente

```bash
npm run serve
```

Isso inicia o emulador de functions no `http://localhost:5001`.

Chamar a função:
```bash
curl -X POST http://localhost:5001/<PROJECT_ID>/<REGION>/syncCatalog
```

## Deploy

### Deploy da Função

```bash
npm run deploy
```

Ou deployar tudo:
```bash
firebase deploy
```

## Funções Disponíveis

### 1. syncCatalog (HTTP)

**URL**: `https://us-central1-<PROJECT_ID>.cloudfunctions.net/syncCatalog`

**Método**: POST

**Resposta**:
```json
{
  "success": true,
  "message": "Sincronização concluída com sucesso",
  "stats": {
    "totalProcessed": 150,
    "totalCreated": 45,
    "totalUpdated": 100,
    "totalSkipped": 5,
    "errors": []
  }
}
```

**Uso no Frontend**:
```typescript
import { triggerCatalogSync } from '@/services/sync/syncService';

const response = await triggerCatalogSync();
console.log(response.stats);
```

### 2. dailySyncSchedule (Pub/Sub)

Executada automaticamente todos os dias às 03:00 UTC.

**Configuração**: Cloud Scheduler (será criado automaticamente na primeira execução)

## Estrutura de Dados

### Normalização de Produtos

A função normaliza produtos do Open Food Facts para o formato interno:

```typescript
interface NormalizedProduct {
  brand: string;
  name: string;
  barcode: string;
  country?: string;
  size?: string;
  imageUrl?: string;
  caffeine?: number;
  description?: string;
  externalId: string;
  provider: 'open-food-facts';
  url?: string;
}
```

### Identificação de Produtos (Prioridade)

1. **Barcode** - Mais confiável
2. **External ID** - Do Open Food Facts
3. **ID Gerado** - Nome + País normalizado

Exemplo de ID gerado: `monster-ultra-violet-usa`

### Rastreamento de Fonte

Cada produto contém um array de fontes:

```typescript
interface CanSource {
  provider: string;           // 'open-food-facts'
  externalId?: string;        // ID do Open Food Facts
  url?: string;               // Link para o produto
  lastCheckedAt?: Timestamp;  // Última verificação
}
```

## Metadados de Sincronização

Armazenados em `catalogMetadata/sync`:

```typescript
{
  lastStartedAt: Timestamp;       // Quando começou
  lastCompletedAt: Timestamp;     // Quando terminou
  lastSuccessfulAt: Timestamp;    // Última sincronização bem-sucedida
  totalProcessed: number;         // Total de produtos processados
  totalCreated: number;           // Produtos novos criados
  totalUpdated: number;           // Produtos atualizados
  totalSkipped: number;           // Produtos pulados
  lastError?: string;             // Último erro ocorrido
}
```

## Configuração de Ambiente

Adicionar ao `.env.local` (se necessário):

```env
VITE_FUNCTIONS_URL=https://us-central1-<PROJECT_ID>.cloudfunctions.net
SYNC_SECRET=<TOKEN_SECRETO>
```

## Tratamento de Erros

- Produtos com dados incompletos são pulados (não falham)
- Erros são registrados em `catalogMetadata/sync.lastError`
- A sincronização continua mesmo se alguns produtos falharem
- Máximo de 5 páginas do Open Food Facts para não exceder limites

## Otimizações

- **Batch Writes**: Não implementado ainda (usar para múltiplos updates)
- **Paginação**: Busca em páginas de 100 produtos
- **Cache**: Open Food Facts retorna dados cacheados
- **Timeout**: 10-15 segundos por requisição

## Segurança

⚠️ **TODO**: Adicionar autenticação com token secreto

```typescript
if (req.header('Authorization') !== `Bearer ${process.env.SYNC_SECRET}`) {
  return res.status(401).send('Unauthorized');
}
```

## Troubleshooting

### Função não sincroniza

1. Verificar logs: `firebase functions:log`
2. Verificar conectividade com Open Food Facts
3. Verificar quotas do Firestore

### Produtos duplicados

1. Verificar se barcode está sendo extraído corretamente
2. Verificar se o Open Food Facts retorna produtos em páginas diferentes

### Lenta

1. Reduzir `pageSize` (atualmente 100)
2. Reduzir `maxPages` (atualmente 5)
3. Usar batch writes em vez de writes individuais

## Próximos Passos

- [ ] Implementar batch writes
- [ ] Adicionar autenticação com token
- [ ] Criar CLI para trigger manual
- [ ] Implementar retry logic com backoff
- [ ] Adicionar filtros para produtos específicos
- [ ] Integrar com outras fontes (Monster Energy, Community)
