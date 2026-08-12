# Cloud Functions - Monster Vault Catalog Synchronization

## Visão Geral

Sistema de sincronização automática do catálogo de Monster Energy com Open Food Facts usando Firebase Cloud Functions.

## Estrutura

```
functions/
├── src/
│   ├── index.ts              # Funções principais (Cloud Functions)
│   ├── offService.ts         # Integração com Open Food Facts API
│   ├── canService.ts         # Gerenciar produtos no Firestore
│   └── types.ts              # Tipos compartilhados
├── lib/                      # Código compilado (gerado)
├── package.json              # Dependências
└── tsconfig.json             # Config TypeScript
```

## Funcionalidades

### 1. **syncCatalog** (HTTP Function)

Sincronização sob demanda com Open Food Facts.

**Tipo**: HTTP Endpoint  
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

### 2. **dailySyncSchedule** (Pub/Sub Function)

Sincronização agendada diariamente às 03:00 UTC.

**Tipo**: Cloud Scheduler (Pub/Sub)  
**Frequência**: Diariamente a `0 3 * * *` (03:00 UTC)  
**Automático**: Sim

## Como Usar

### Setup Inicial

1. Instalar dependências:
```bash
cd functions
npm install
```

2. Compilar TypeScript:
```bash
npm run build
```

### Desenvolvimento Local

1. Iniciar emuladores:
```bash
firebase emulators:start --only functions
```

2. Chamar função localmente:
```bash
curl -X POST http://localhost:5001/<PROJECT_ID>/<REGION>/syncCatalog
```

### Deploy em Produção

1. Deploy da função:
```bash
firebase deploy --only functions
```

2. Ver logs:
```bash
firebase functions:log
```

## Fluxo de Sincronização

```
1. Registrar Início (lastStartedAt)
   ↓
2. Buscar produtos Monster do Open Food Facts (paginado)
   ↓
3. Para cada produto:
   - Normalizar dados
   - Validar campos obrigatórios
   - Buscar produto existente
   ↓
4. Classificar em:
   - ✨ Novo → Criar
   - ⚡ Existente → Atualizar
   - ⏭️  Inválido → Pular
   ↓
5. Atualizar catalogMetadata com estatísticas
   ↓
6. Registrar Conclusão (lastCompletedAt/lastSuccessfulAt)
```

## Lógica de Identificação de Produtos

A função identifica produtos existentes usando prioridade:

### 1. Barcode (Máxima Confiabilidade)
- Se houver barcode, buscar por ID do documento
- Exemplo: `5000112157646`

### 2. External ID (via Open Food Facts)
- Se produto foi sincronizado antes, tem source.externalId
- Buscar em array de sources

### 3. ID Gerado (Fallback)
- Gerar ID determinístico a partir de: `nome-país`
- Exemplo: `monster-ultra-violet-usa`

```typescript
// Função de geração de ID
generateCanId(barcode?, externalId?, name?, country?)

// Prioridade:
// 1. barcode → '5000112157646'
// 2. externalId → '123456789'
// 3. generateCanId → 'monster-ultra-violet-usa'
```

## Normalização de Dados

Converte produtos do Open Food Facts para formato interno:

```typescript
interface OpenFoodFactsProduct {
  code: string;           // Barcode
  product_name: string;   // Nome
  brands: string;         // Marca
  countries: string;      // País
  image_url: string;      // Imagem
  nutriments?: {
    caffeine_100g?: number;
  };
}

↓ (normalizeProduct)

interface NormalizedProduct {
  brand: string;          // "Monster Energy"
  name: string;           // "Ultra Violet"
  barcode: string;        // "5000112157646"
  country: string;        // "USA"
  size: string;           // "473ml"
  imageUrl: string;       // URL
  caffeine?: number;      // Calculado
  externalId: string;     // ID do OFF
  provider: string;       // "open-food-facts"
}
```

## Estatísticas de Sincronização

Armazenadas em `catalogMetadata/sync`:

```typescript
{
  lastStartedAt: Date;        // Quando começou
  lastCompletedAt: Date;      // Quando terminou
  lastSuccessfulAt: Date;     // Última bem-sucedida
  totalProcessed: number;     // Total analisado
  totalCreated: number;       // Produtos novos
  totalUpdated: number;       // Produtos atualizados
  totalSkipped: number;       // Pulados (dados incompletos)
  lastError?: string;         // Erro se houver
}
```

## Tratamento de Erros

- **Dados Incompletos**: Produto é pulado (não falha)
- **Erros de Network**: Registrado em `lastError`
- **Conflitos**: Último ganha (merge de sources)
- **Continuação**: Sincronização continua mesmo com erros

## Otimizações

### Paginação
- Busca em páginas de 100 produtos
- Limite de 5 páginas na sincronização manual
- Sem limite na sincronização agendada (apenas primeira página para teste)

### Caching
- Open Food Facts cache automático
- Evita re-buscar mesmos produtos

### Deduplicação de Fontes
- Verifica se `source` já existe
- Atualiza `lastCheckedAt` se existir
- Não duplica mesma fonte

## Segurança

⚠️ **TODO**: Implementar autenticação

Adicionar validação de token:

```typescript
const token = req.header('Authorization')?.replace('Bearer ', '');
if (token !== process.env.SYNC_SECRET) {
  return res.status(401).send('Unauthorized');
}
```

## Quota e Limites

### Firestore
- Leitura: ~1k/sec (dependendo de documentos por leitura)
- Escrita: ~500/sec
- Tamanho: ~1MB por documento

### Open Food Facts
- Rate limit: 1 requisição por segundo (aproximado)
- Max 100 resultados por página

### Cloud Functions
- Timeout: 60 segundos (padrão)
- Memória: 512MB (padrão)
- Limite de execução: $1/mês de uso

## Troubleshooting

### Função não executa
```bash
firebase functions:log
# Ver logs em tempo real
```

### Produtos duplicados
1. Verificar se barcode está sendo extraído
2. Verificar se externalId é único

### Lenta
1. Reduzir `pageSize` (está 100)
2. Reduzir `maxPages` (está 5)

### Erro de CORS
Open Food Facts não requer, mas adicionar se necessário:
```typescript
res.header('Access-Control-Allow-Origin', '*');
```

## Próximos Passos

- [ ] Batch writes para performance
- [ ] Autenticação com token
- [ ] CLI para trigger manual
- [ ] Retry com exponential backoff
- [ ] Integrar mais fontes
- [ ] Monitoramento e alertas

## Recursos Úteis

- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Open Food Facts API](https://world.openfoodfacts.org/data)
- [Firebase Local Emulator](https://firebase.google.com/docs/emulator-suite)
