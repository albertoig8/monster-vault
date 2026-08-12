# 🔧 Monster Vault - Admin Panel Guide

## Quick Start

The Admin Panel is a simple, web-based tool to manage Monster Vault database. No command line needed!

### Access Admin Panel

1. **Login** to the app (use any test account)
2. Click **🔧 Admin** link in the navigation bar
3. You're in the Admin Panel

### Seed Database with Sample Data

```
1. Go to → /admin
2. Click → "🌱 Fazer Seed de Dados" button
3. Wait → for ✅ success message
4. Check → Firestore console or Catalog page
```

**What it does:**
- Adds 5 Monster Energy sample products
- Sets up `catalogMetadata/sync` with sync timestamps
- Ready for testing sync functionality

**Sample Products Added:**
| Name | Country | Size | Caffeine | Flavor |
|------|---------|------|----------|--------|
| Ultra Violet | USA | 473ml | 160mg | Grape |
| Absolutely Zero | USA | 473ml | 160mg | Original |
| Mango Loco | Brazil | 473ml | 160mg | Mango |
| Rehab Tea+Lemonade | UK | 500ml | 80mg | Tea |
| Japan Limited | Japan | 250ml | 80mg | Original |

## Testing Workflow

### Test Sync with API

```
1. Seed database (👆 above)
2. Go to Catalog page (/catalog)
3. See 5 products listed
4. Click "Sincronizar Agora" button
5. Watch spinner during sync
6. See new products from Open Food Facts API
```

### Check Sync Status

- **Last Update**: Shows when catalog was last synced
- **Statistics**: totalProcessed, totalCreated, totalUpdated, totalSkipped
- **Timestamps**: lastStartedAt, lastCompletedAt, lastSuccessfulAt
- **Errors**: Shows if sync failed with error message

## Cloud Functions Status

### Local Testing

```bash
# Start dev server
npm run dev

# Build frontend
npm run build

# Build functions
cd functions && npm run build
```

### Deploy to Production

```bash
# Deploy only Cloud Functions
firebase deploy --only functions

# Deploy frontend only
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

### Monitor Function Executions

```bash
# View function logs
firebase functions:log

# Filter by function name
firebase functions:log --only=syncCatalog
```

## Firestore Collections

### `cans` Collection
Stores all Monster Energy products with fields:
- `id`, `brand`, `name`, `flavor`, `description`
- `category`, `country`, `size`, `barcode`
- `imageUrl`, `releaseYear`, `caffeine`, `sugar`
- `discontinued`, `edition`, `verified`
- `sources`: Array of {provider, lastCheckedAt}
- `createdAt`, `updatedAt`: ISO strings

### `catalogMetadata/sync` Document
Stores sync metadata:
```typescript
{
  lastStartedAt: "2024-01-15T10:30:00.000Z",
  lastCompletedAt: "2024-01-15T10:32:15.000Z",
  lastSuccessfulAt: "2024-01-15T10:32:15.000Z",
  totalProcessed: 50,
  totalCreated: 48,
  totalUpdated: 2,
  totalSkipped: 0,
  lastError?: "Error message if sync failed"
}
```

## Troubleshooting

### Admin Button Not Showing

- ✅ Make sure you're logged in
- ✅ Check navigation bar → should show "🔧 Admin"
- ✅ If missing, rebuild: `npm run build`

### Seed Button Not Working

- ✅ Make sure you're logged in to Firebase
- ✅ Check browser console for errors (F12 → Console)
- ✅ Verify Firestore rules allow writes from authenticated users

### Products Not Appearing After Seed

- ✅ Hard refresh page: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- ✅ Check Firestore console: `cans` collection should have 5 docs
- ✅ Check `catalogMetadata/sync` doc exists

### Sync Button Not Working

- ✅ Functions deployed? Run: `firebase deploy --only functions`
- ✅ CORS working? Cloud Function should respond to OPTIONS request
- ✅ API accessible? Check Open Food Facts: https://world.openfoodfacts.org/

## API Integration

### Open Food Facts API

- **Endpoint**: `https://world.openfoodfacts.org/cgi/search.pl`
- **Query**: Searches for "Monster Energy" brand
- **Rate Limit**: ~1 request/second, max 100 results/page
- **Pagination**: Pages 1-5 fetched per sync

### Normalization

Raw OFF data → Monster Vault format:
- **Size**: "473 ml" → "473ml" (parsed from product name)
- **Caffeine**: `caffeine_100g` × `sizeInMl` ÷ 100
- **Country**: Maps names (e.g., "United States" → "USA")
- **Image**: Uses `image_url` if available

## Environment Variables

### Frontend (.env or Vite config)

```
VITE_FIREBASE_PROJECT_ID=monster-vault-4a4c8
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

### Cloud Functions

Auto-uses Firebase project from `.firebaserc`:
```json
{
  "projects": {
    "default": "monster-vault-4a4c8"
  }
}
```

## Support

For issues:
1. Check browser console (F12 → Console tab)
2. Check Firebase console → Firestore data
3. Check Cloud Functions logs: `firebase functions:log`
4. Check network requests: F12 → Network tab

---

**Happy cataloging! 🔥**
