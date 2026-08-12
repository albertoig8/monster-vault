# 🔐 Resolvendo Erro de Permissões do Firestore

## ❌ Problema

```
FirebaseError: Missing or insufficient permissions
```

**O que significa**: As regras de Firestore estão negando acesso de escrita.

---

## ✅ Solução 1: Usar Firebase Emulator (Recomendado para Dev)

**Vantagem**: Sem credenciais necessárias, offline-first, testes rápidos  
**Tempo**: ~2 minutos

### Passo 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Passo 2: Iniciar Emulador

```bash
firebase emulators:start --import=./emulator-data
```

Você verá algo como:
```
✓ Firestore Emulator running on 127.0.0.1:8080
✓ Auth Emulator running on 127.0.0.1:9099
```

### Passo 3: Rodar App (nova aba/terminal)

```bash
npm run dev
```

### Passo 4: Testar Admin Panel

1. Abra `http://localhost:5174`
2. Login com qualquer email/senha (emulador permite qualquer coisa)
3. Vá para `/admin`
4. Clique "🌱 Fazer Seed de Dados"
5. ✅ **Deve funcionar agora!**

**Console mostrará**:
```
✅ Conectado ao Firestore Emulator (porta 8080)
✅ Conectado ao Auth Emulator (porta 9099)
```

---

## ✅ Solução 2: Fazer Deploy das Regras (Produção)

**Vantagem**: Usa seu projeto real Firebase  
**Tempo**: ~5 minutos

### Passo 1: Autenticar CLI

```bash
firebase login
```

- Abrirá navegador
- Faça login com sua conta Google
- Autorize Firebase CLI
- Retorna ao terminal

### Passo 2: Fazer Deploy das Regras

```bash
firebase deploy --only firestore:rules
```

Você verá:
```
✓ Firestore Rules have been published successfully
```

### Passo 3: Testar Admin Panel

1. Abra `http://localhost:5174`
2. Vá para `/admin`
3. Clique "🌱 Fazer Seed de Dados"
4. ✅ **Deve funcionar agora!**

---

## 🔄 Qual Solução Escolher?

| Aspecto | Emulator | Produção |
|--------|----------|----------|
| Configuração | 🟢 Fácil | 🟡 Requer login |
| Velocidade | 🟢 Muito rápida | 🟡 Normal |
| Dados Persistem | 🟡 Apenas sessão | 🟢 Sim |
| Para Desenvolvimento | 🟢 Ideal | 🔴 Não recomendado |
| Para Testes | 🟢 Melhor | 🟡 OK |
| Para Produção | 🔴 Nunca | 🟢 Ideal |

**Recomendação**: Use **Emulator para desenvolvimento** e **Produção para deploy real**.

---

## 🚀 Combinado (Melhor Workflow)

Rodar tudo junto em uma aba:

```bash
npm install -g concurrently
npm run dev:with-emulator
```

Isso inicia:
- ✅ Firestore Emulator
- ✅ Auth Emulator  
- ✅ App Dev Server

Tudo em uma janela!

---

## 📝 Regras de Segurança Aplicadas

Arquivo: `firestore.rules`

```
✅ PERMITIDO (usuários autenticados):
   - Ler/escrever em /cans/* (produtos)
   - Ler/escrever em /catalogMetadata/* (metadados)
   - Ler/escrever em /users/{meuID}/* (dados pessoais)

❌ BLOQUEADO (todos):
   - Escrever em /cans/* (sem autenticação)
   - Deletar produtos de outros usuários
   - Modificar dados de outros usuários
```

---

## 🧪 Verificar Se Funcionou

### No Console do Browser (F12)

Você deve ver mensagens como:

**Se usando Emulator**:
```
✅ Conectado ao Firestore Emulator (porta 8080)
✅ Conectado ao Auth Emulator (porta 9099)
```

**Se usando Produção**:
```
⚠️  Firestore Emulator não disponível, usando produção
⚠️  Auth Emulator não disponível, usando produção
```

### No Admin Panel

Ao clicar "🌱 Fazer Seed de Dados":

**Sucesso**:
```
✅ 5 latas adicionadas com sucesso!
```

**Erro**:
```
❌ Erro: FirebaseError: Missing or insufficient permissions
```

---

## ❓ Troubleshooting

### Erro: "firebase command not found"
```bash
npm install -g firebase-tools
```

### Erro: "Invalid authentication token"
```bash
firebase logout
firebase login
```

### Emulator não conecta
- Certifique que: `firebase emulators:start` está rodando
- Verifique porta 8080: `lsof -i :8080`
- Reinicie: `Ctrl+C` e rode novamente

### Dados não aparecem no Catálogo
1. Refresh page: `Ctrl+Shift+R`
2. Verificar Console (F12) por erros
3. Verificar Firebase Console → Firestore → Data

---

## 📚 Documentação

- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

**Próximo passo**: Escolha uma solução acima e execute! 🎉

Dúvidas? Verifique as mensagens do console (F12 → Console tab).
