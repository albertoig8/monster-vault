# Monster Vault 🔥

Um aplicativo web moderno para gerenciar e catalogar sua coleção pessoal de Monster Energy.

## Características

- 🔐 Autenticação com Firebase (Email/Senha e Google)
- 📚 Catálogo completo de latas Monster Energy
- 🎯 Gerenciamento de coleção pessoal
- ❤️ Lista de desejos (Wishlist)
- 📊 Estatísticas de coleção
- 🔍 Busca e filtros
- 📱 Interface responsiva (Desktop e Mobile)
- 🌙 Tema escuro otimizado para energia

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Compilação**: Vite
- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Cloud Firestore
- **Estilo**: CSS3
- **Roteamento**: React Router v6

## Instalação Rápida

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd monster-vault
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Firebase

1. Criar um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar autenticação (Email/Senha e Google)
3. Ativar Cloud Firestore
4. Copiar as credenciais do projeto

### 4. Configurar variáveis de ambiente

1. Copiar `.env.example` para `.env.local`
2. Adicionar as credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Iniciar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Estrutura do Banco de Dados (Firestore)

### Coleção `users`
```
users/{userId}/
  ├── name: string
  ├── email: string
  └── createdAt: timestamp
```

### Coleção `cans`
```
cans/{canId}/
  ├── name: string
  ├── flavor: string
  ├── size: string
  ├── country: string
  ├── discontinued: boolean
  ├── imageUrl: string
  └── ... (mais campos opcionais)
```

### Subcoleção `users/{userId}/collection`
```
collection/{canId}/
  ├── quantity: number
  └── addedAt: timestamp
```

### Subcoleção `users/{userId}/wishlist`
```
wishlist/{canId}/
  └── addedAt: timestamp
```

## Funcionalidades Implementadas

- ✅ Autenticação com Firebase
- ✅ Catálogo de latas com busca
- ✅ Página de detalhes de lata
- ✅ Gerenciar coleção pessoal
- ✅ Wishlist
- ✅ Estatísticas de coleção
- ✅ Interface responsiva

## Próximas Funcionalidades

- [ ] Filtros e ordenação avançada
- [ ] Scanner de código de barras
- [ ] Sistema de raridade
- [ ] Achievements
- [ ] Perfis públicos
- [ ] Compartilhamento
- [ ] Sincronização de catálogo

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Licença

MIT License - Veja LICENSE para detalhes.

---

**Monster Vault** - Colecione, organize e rastreie sua paixão por Monster Energy! 🔥
