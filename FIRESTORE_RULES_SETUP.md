# 🔐 Firestore Rules Deployment Guide

## ⚠️ Problema Encontrado

Erro: `FirebaseError: Missing or insufficient permissions`

**Causa**: As regras de Firestore estão muito restritivas (por padrão, negam tudo).

---

## ✅ Solução Rápida (Recomendado)

### 1️⃣ Autenticar no Firebase CLI

```bash
firebase login
```

Este comando:
- Abrirá seu navegador
- Você fará login com a conta Google associada ao projeto Firebase
- Retornará um token de autenticação ao CLI

### 2️⃣ Fazer Deploy das Regras

```bash
firebase deploy --only firestore:rules
```

Isso aplicará o arquivo `firestore.rules` ao seu projeto.

### 3️⃣ Testar Admin Panel Novamente

1. Volte para o app em `http://localhost:5174`
2. Vá para `/admin`
3. Clique "🌱 Fazer Seed de Dados"
4. ✅ Agora deve funcionar!

---

## 🧪 Alternativa: Usar Emulador Firestore (Desenvolvimento Local)

Se não quiser fazer login, pode usar o emulador local para testes:

### Iniciar Emulador

```bash
firebase emulators:start
```

Isso inicia:
- ✅ Firestore Emulator (porta 8080)
- ✅ Auth Emulator (porta 9099)
- ✅ Functions Emulator (porta 5001)
- ✅ Pub/Sub Emulator (porta 8085)

### Conectar App ao Emulador

No arquivo `src/services/firebase/config.ts`, adicione após `initializeApp(firebaseConfig)`:

```typescript
// Usar emulador em desenvolvimento
if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}
```

### Reiniciar App

```bash
npm run dev
```

Agora o app usará o emulador local (sem credenciais necessárias).

---

## 📋 Regras de Segurança Aplicadas

```
✅ Usuários autenticados podem:
  - Ler e escrever em /cans/* (produtos)
  - Ler e escrever em /catalogMetadata/* (metadados)
  - Ler e escrever em /users/{uid}/collection/* (sua coleção)
  - Ler e escrever em /users/{uid}/wishlist/* (sua wishlist)

❌ Usuários não autenticados não podem:
  - Fazer qualquer leitura ou escrita
```

---

## 🔍 Verificar Status das Regras

### No Console Firebase (Web)

1. Acesse: https://console.firebase.google.com
2. Projeto: **monster-vault-4a4c8**
3. Menu → **Firestore Database**
4. Aba: **Rules**
5. Deve mostrar o conteúdo de `firestore.rules`

### Via CLI

```bash
firebase firestore:indexes
firebase rules:test firestore.rules --database=monster-vault-4a4c8
```

---

## 🚀 Checklist para Resolver

- [ ] 1. Executar `firebase login`
- [ ] 2. Executar `firebase deploy --only firestore:rules`
- [ ] 3. Ir para `/admin` no app
- [ ] 4. Clicar "🌱 Fazer Seed de Dados"
- [ ] 5. ✅ Sucesso! Produtos adicionados

---

## ❓ Dúvidas?

- **Problema**: "firebase command not found"
  - Solução: `npm install -g firebase-tools`

- **Problema**: "Invalid authentication token"
  - Solução: `firebase logout` depois `firebase login` novamente

- **Problema**: Ainda dá erro de permissão
  - Verificar: As regras foram aplicadas? (Console Firebase → Firestore → Rules)
  - Verificar: Usuário está autenticado? (Veja email na barra de header)

---

**Próximo passo**: Após fazer deploy das regras, volte para o admin panel e teste! 🎉
