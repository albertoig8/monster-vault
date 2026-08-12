# 📚 Como Popular o Firestore com Dados

## Passo 1: Gerar Service Account Key

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto **monster-vault-4a4c8**
3. Clique no ⚙️ (engrenagem) no canto superior esquerdo → **Project Settings**
4. Vá para a aba **Service Accounts**
5. Clique em **Generate New Private Key**
6. Um arquivo JSON será baixado (`firebaseServiceAccountKey.json` ou similar)
7. Renomeie para `serviceAccountKey.json`
8. **Coloque na raiz do projeto**: `/workspaces/monster-vault/serviceAccountKey.json`

```
/workspaces/monster-vault/
├── serviceAccountKey.json  ← Cole aqui
├── src/
├── scripts/
└── ...
```

## Passo 2: Executar Script de Seed

```bash
cd /workspaces/monster-vault
node scripts/seedFirestore.js
```

### Saída esperada:
```
🚀 Iniciando seed do Firestore...

✅ Criado: Monster Ultra Violet
✅ Criado: Monster Lo-Carb
✅ Criado: Monster Mango Loco
...
==================================================
📊 Resultados:
  ✅ Criados: 10
  ✏️  Atualizados: 0
  📦 Total: 10
==================================================

✨ Seed concluído com sucesso!
🌐 Acesse: http://localhost:5173/catalog
```

## Passo 3: Verificar Firestore

Para confirmar que os dados foram adicionados:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione **monster-vault-4a4c8**
3. Vá em **Firestore Database** (no menu lateral)
4. Você deve ver a coleção **`cans`** com os documentos

![Firestore collections](./docs/firestore-collections.png)

## Passo 4: Testar na Aplicação

1. Certifique-se que o servidor está rodando: `npm run dev`
2. Abra http://localhost:5173/
3. Faça login
4. Vá em **Catalog** 🎯

Você deve ver **10 latas de Monster** carregadas!

## ⚠️ Segurança

- ❌ **Nunca commite** `serviceAccountKey.json` no Git
- ✅ Já está no `.gitignore`
- 🔐 Essa chave dá acesso total ao seu projeto Firebase

## Se der erro...

### Erro: `serviceAccountKey.json não encontrado`

- Verifique o caminho do arquivo
- Certifique-se de colocar na **raiz** do projeto
- Reinicie o script

### Erro: `auth/unauthorized`

- Verifique se a chave é do projeto correto
- Regenere uma nova chave

### Erro: `permission-denied`

- Vá em **Firestore Database** → **Rules**
- Coloque estas regras temporárias para desenvolvimento:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Próximos passos

Após popular o Firestore:

1. ✅ Teste adicionar latas à sua coleção
2. ✅ Teste adicionar à wishlist
3. ✅ Verifique estatísticas no Home
4. ✅ Procure por latas no Catalog

Tudo funcionando? **Parabéns!** 🎉

## 📌 Alternativas

Se não quiser usar o script:

### Opção A: Firebase Console (Manual)
1. Abra Firestore → Coleção `cans` → Adicionar documento
2. Cole os dados manualmente (não recomendado)

### Opção B: Cloud Function
Você pode criar uma Cloud Function que roda o seed automaticamente:
- Ver PLAN.md seção "14. Daily Catalog Synchronization"

### Opção C: Integração com API
Para futuras versões (Phase 4), integre com:
- **Open Food Facts** - Banco de dados de produtos
- **Barcode Lookup API** - Dados por código de barras
- **Custom Scraper** - Coletar dados de site oficial

---

**Dúvidas?** Veja `README.md` ou `DEVELOPMENT.md`
