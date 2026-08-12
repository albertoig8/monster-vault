# Monster Vault — Catalog & Data Synchronization Plan

## 1. Objective

Implement a reliable catalog system for Monster Energy cans.

The goal is to build and maintain a local catalog in Firebase Firestore containing information about Monster Energy cans, including:

* Product name
* Flavor
* Country
* Size
* Barcode
* Product image
* Release year
* Nutritional information
* Discontinued status
* Data source
* Verification status

The application must NOT depend directly on external APIs during normal frontend usage.

Firestore must be the primary data source for the application.

External sources should only be used by backend synchronization/import processes.

---

# 2. Data Sources

Use multiple sources whenever possible.

The initial sources should be:

## 2.1 Open Food Facts

Use Open Food Facts as the primary automated source.

Potential information:

* Product name
* Brand
* Barcode
* Ingredients
* Nutritional information
* Product images
* Country
* Product size

The integration should use the Open Food Facts API.

Do not assume that Open Food Facts contains every Monster Energy product.

Missing products are expected.

---

## 2.2 Monster Energy Official Website

Use the official Monster Energy website as a secondary source.

Use it primarily to:

* Validate currently available products.
* Validate product names.
* Validate flavors.
* Validate product images when possible.
* Detect currently marketed products.

Do not treat the official website as a historical database.

A product disappearing from the official website must NOT automatically mean that the product should be deleted from Monster Vault.

---

## 2.3 Community Sources

Community websites and public datasets can be used as supplementary sources for historical products.

One example is Can Collector.

Do not scrape or reuse data from websites unless their terms or permission allow it.

If a source does not provide a public API or explicitly allow automated data reuse, do not implement scraping.

Community data can instead be imported manually through a controlled import process.

---

# 3. Important Data Philosophy

Monster Vault is a collection application.

Therefore, historical products are important.

A can that is no longer available commercially must remain in the database.

Never automatically delete a can because it disappeared from an external source.

Instead:

```text
discontinued = true
```

The catalog should preserve historical products.

---

# 4. Canonical Monster Can Model

Create a normalized internal model.

Example:

```typescript
interface MonsterCan {
  id: string;

  brand: string;

  name: string;

  flavor?: string;

  description?: string;

  category?: string;

  country?: string;

  size?: string;

  barcode?: string;

  imageUrl?: string;

  releaseYear?: number;

  caffeine?: number;

  sugar?: number;

  discontinued: boolean;

  edition?: string;

  verified: boolean;

  sources: CanSource[];

  createdAt: Timestamp;

  updatedAt: Timestamp;
}
```

Source model:

```typescript
interface CanSource {
  provider: string;

  externalId?: string;

  url?: string;

  lastCheckedAt?: Timestamp;
}
```

Do not expose external API models directly to the React application.

---

# 5. Product Identity

The system needs a reliable way to determine whether two records represent the same can.

Use the following priority:

```text
1. Barcode
2. External provider ID
3. Deterministic generated ID
```

Do not use random IDs when synchronizing products.

Example:

```text
monster-ultra-violet-us-473ml
```

However, if a barcode exists, it should be preferred as the canonical identifier or unique identity key.

---

# 6. Country-Specific Products

Treat country as part of the product identity when appropriate.

The same flavor may have different cans in different countries.

Example:

```text
Monster Ultra Violet

USA
473ml

UK
500ml

Brazil
473ml
```

Do not automatically merge these into a single product.

A collector may own the US version and not the Brazilian version.

The catalog should support country-specific variations.

---

# 7. Firestore Structure

Use the following structure:

```text
cans
  └── {canId}
       ├── brand
       ├── name
       ├── flavor
       ├── description
       ├── category
       ├── country
       ├── size
       ├── barcode
       ├── imageUrl
       ├── releaseYear
       ├── caffeine
       ├── sugar
       ├── discontinued
       ├── edition
       ├── verified
       ├── sources
       ├── createdAt
       └── updatedAt
```

Create a separate metadata document:

```text
catalogMetadata
  └── sync
       ├── lastStartedAt
       ├── lastCompletedAt
       ├── lastSuccessfulAt
       ├── totalProcessed
       ├── totalCreated
       ├── totalUpdated
       ├── totalSkipped
       └── lastError
```

---

# 8. Synchronization Architecture

The architecture should be:

```text
External Sources
       |
       v
Cloud Function
       |
       v
Fetch Data
       |
       v
Normalize Data
       |
       v
Validate Data
       |
       v
Identify Existing Products
       |
       +------ Existing ------> Update
       |
       +------ New -----------> Create
       |
       v
Firestore
       |
       v
React Application
```

The React frontend must never call Open Food Facts directly for normal catalog browsing.

---

# 9. Cloud Function

Create a Firebase Cloud Function responsible for catalog synchronization.

The function should:

1. Start synchronization.
2. Record `lastStartedAt`.
3. Fetch products from Open Food Facts.
4. Normalize the external data.
5. Validate required fields.
6. Identify existing cans.
7. Create new cans.
8. Update existing cans.
9. Preserve historical cans.
10. Update synchronization metadata.
11. Record errors if synchronization fails.

Use appropriate batching when writing many Firestore documents.

Do not perform thousands of individual writes when Firestore batch writes can be used.

---

# 10. Daily Schedule

Configure the Cloud Function to execute once per day.

Example:

```text
03:00 UTC
```

The exact time can be changed later.

The important requirement is:

```text
once every 24 hours
```

The synchronization should be safe to execute multiple times.

---

# 11. Idempotency

Synchronization must be idempotent.

Running:

```text
sync()
sync()
sync()
```

must NOT create:

```text
Monster Ultra Violet #1
Monster Ultra Violet #2
Monster Ultra Violet #3
```

It must always resolve to the same catalog product.

---

# 12. Data Normalization

Create a dedicated normalization layer.

Example:

```text
OpenFoodFactsProduct
          |
          v
normalizeOpenFoodFactsProduct()
          |
          v
MonsterCan
```

The normalization process should:

* Normalize product names.
* Normalize country names.
* Normalize sizes.
* Extract flavor information when possible.
* Extract barcode.
* Extract image URL.
* Extract nutritional information.
* Remove invalid values.
* Normalize missing values.

Do not put normalization logic inside React components.

---

# 13. Data Validation

Before saving a product, validate the data.

At minimum:

```text
name
brand
```

should exist.

Prefer products with:

```text
barcode
image
country
size
```

but do not reject every product that lacks optional information.

For example, this should still be allowed:

```json
{
  "name": "Monster Ultra Violet",
  "brand": "Monster Energy",
  "country": "USA",
  "imageUrl": null
}
```

The frontend must gracefully handle missing images.

---

# 14. Image Handling

Prefer external image URLs initially.

Do not download every product image into Firebase Storage during the first implementation.

Store:

```text
imageUrl
```

in Firestore.

If the external image source proves unreliable later, implement an image migration process to Firebase Storage.

The frontend should display a placeholder when an image is missing.

---

# 15. Source Tracking

Every product should maintain information about where its data came from.

Example:

```json
{
  "sources": [
    {
      "provider": "open-food-facts",
      "externalId": "123456789",
      "lastCheckedAt": "..."
    }
  ]
}
```

If information is found from multiple sources:

```json
{
  "sources": [
    {
      "provider": "open-food-facts"
    },
    {
      "provider": "monster-energy"
    }
  ]
}
```

Do not overwrite the complete source list when updating a product.

Merge source information.

---

# 16. Product Updates

When an existing product is found:

* Update fields that have better/newer information.
* Preserve manually entered information.
* Preserve historical metadata.
* Preserve verification status when appropriate.
* Update `updatedAt`.

Do not blindly replace the entire Firestore document with the external API response.

The external API does not necessarily contain all Monster Vault fields.

---

# 17. Manual Data

The database must support manually curated information.

Some information may not be available through APIs.

Examples:

```text
releaseYear
edition
rarity
historical notes
collector notes
```

External synchronization must not erase manually curated fields.

Consider marking manually maintained fields internally if necessary.

---

# 18. Discontinued Products

Never delete products automatically.

If an external source indicates that a product is no longer available:

```text
discontinued = true
```

If a product disappears from a source without explicit evidence of discontinuation:

```text
Do not automatically mark it as discontinued.
```

Absence from an API is not sufficient evidence that a product has been discontinued.

---

# 19. Duplicate Detection

Create a duplicate detection strategy.

Possible matching criteria:

```text
barcode
```

then:

```text
external provider ID
```

then a combination such as:

```text
normalized name
+
country
+
size
```

Do not merge products automatically when confidence is low.

If uncertain, skip automatic merging and log the potential duplicate.

---

# 20. Synchronization Logs

The Cloud Function should produce useful logs.

Example:

```text
Catalog synchronization started.

Provider: Open Food Facts

Products fetched: 542

Products processed: 542
Products created: 18
Products updated: 103
Products skipped: 421

Synchronization completed successfully.
```

For errors:

```text
Catalog synchronization failed.

Provider: Open Food Facts

Error: API request failed.

No catalog data was deleted.
```

Never delete existing catalog data because an external API temporarily fails.

---

# 21. Failure Safety

If an external API is unavailable:

```text
Do NOT modify existing products.
Do NOT delete products.
Do NOT mark products as discontinued.
```

The synchronization should simply fail and record the error.

The next scheduled synchronization can try again.

---

# 22. API Rate Limits

Respect external API rate limits.

Do not make unnecessary requests.

Use pagination where supported.

Do not request the same product repeatedly during a single synchronization.

If the API provides bulk datasets or efficient search endpoints, prefer them over thousands of individual requests.

---

# 23. Initial Catalog Import

Before enabling daily synchronization:

Create an initial import process.

The process should:

1. Fetch available Monster Energy products.
2. Normalize them.
3. Validate them.
4. Save them to Firestore.
5. Report the number of products imported.

Example:

```text
Initial catalog import

Fetched: 500
Created: 350
Skipped: 150
Errors: 0
```

This allows the application to start with an existing catalog.

---

# 24. Admin Synchronization

Create an internal mechanism to manually trigger synchronization during development.

For example:

```text
POST /sync-catalog
```

or an authenticated Firebase callable function.

This should be protected.

Do not expose an unrestricted synchronization endpoint publicly.

This is useful for testing instead of waiting 24 hours.

---

# 25. Frontend Catalog

The React application should only query:

```text
Firestore -> cans
```

The frontend should not know:

* Open Food Facts API structure
* Monster website structure
* Synchronization logic
* External API credentials
* Provider-specific implementation

The frontend should only understand:

```typescript
MonsterCan
```

---

# 26. Catalog UI

The Catalog page should display:

```text
Monster Vault

Search cans...

Filters:

Country
Flavor
Size
Year
Status

--------------------------------

[Can Card]
[Can Card]
[Can Card]
[Can Card]
```

Each card:

```text
Image

Monster Ultra Violet
Grape

🇺🇸 USA
473ml

[ View Details ]
```

---

# 27. Catalog Status

Display synchronization information somewhere in the application.

Example:

```text
Catalog updated:
August 12, 2026
```

If the last synchronization failed:

```text
Catalog update:
Last successful update: August 11, 2026
```

Do not expose technical error messages to normal users.

---

# 28. Future Data Improvements

The architecture should make it possible to add additional providers later.

Example:

```text
Open Food Facts
       |
       v
Provider Adapter
       |
       v
MonsterCan

Monster Official
       |
       v
Provider Adapter
       |
       v
MonsterCan

Community Dataset
       |
       v
Provider Adapter
       |
       v
MonsterCan
```

Each provider should have its own adapter.

Example:

```text
services/catalog/providers/
├── openFoodFactsProvider.ts
├── monsterEnergyProvider.ts
└── communityProvider.ts
```

Do not mix provider-specific logic.

---

# 29. Provider Interface

Create a generic interface so new providers can be added easily.

Example:

```typescript
interface CatalogProvider {
  getMonsterCans(): Promise<ExternalMonsterCan[]>;
}
```

Then:

```text
OpenFoodFactsProvider implements CatalogProvider
```

Future providers can implement the same interface.

---

# 30. Recommended Development Order

Implement this feature in the following order.

## Phase 1 — Data Model

* Create `MonsterCan`.
* Create `CanSource`.
* Create Firestore structure.
* Create TypeScript types.

## Phase 2 — Manual Catalog

* Create a small set of test cans.
* Display them in the Catalog page.
* Implement can details.

## Phase 3 — Open Food Facts

* Create provider.
* Test API access.
* Fetch Monster products.
* Normalize products.
* Validate products.

## Phase 4 — Firestore Import

* Implement initial import.
* Implement duplicate detection.
* Implement batch writes.
* Add synchronization metadata.

## Phase 5 — Cloud Function

* Move synchronization to Firebase Functions.
* Add scheduled execution.
* Add logging.
* Add error handling.

## Phase 6 — Catalog Improvements

* Search
* Filters
* Country
* Flavor
* Size
* Release year
* Discontinued status

## Phase 7 — Collection Integration

Ensure users can:

* Add catalog items to collection.
* Track quantity.
* Remove items.
* Add items to wishlist.

## Phase 8 — Data Quality

* Source tracking
* Verification
* Manual fields
* Duplicate detection
* Better image handling

---

# 31. Important Restrictions

Do NOT:

* Scrape websites without permission.
* Copy copyrighted datasets without permission.
* Depend on unofficial APIs without checking their availability and terms.
* Delete historical products.
* Delete the entire catalog if an API fails.
* Let external API models leak into the frontend.
* Store API credentials in the React application.
* Automatically merge products when the match is uncertain.
* Assume that the absence of a product means it was discontinued.

---

# 32. Success Criteria

The catalog system is complete when:

1. Firestore contains Monster Energy cans.
2. The React application can display those cans.
3. The frontend only depends on Firestore.
4. Open Food Facts can be used as an external data provider.
5. Products can be normalized into the internal `MonsterCan` model.
6. Products can be imported without creating duplicates.
7. Existing products can be updated.
8. Historical products are preserved.
9. External API failures do not destroy existing data.
10. Synchronization can run repeatedly without creating duplicates.
11. Synchronization can run automatically once per day.
12. Synchronization metadata is stored.
13. Errors are logged.
14. Images and missing fields are handled gracefully.
15. The architecture allows additional providers to be added later.

---

# 33. Final Architecture

The final architecture should look like:

```text
                    ┌──────────────────────┐
                    │   Open Food Facts    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Catalog Provider      │
                    │ Adapter               │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Data Normalization    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Validation & Matching │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Firestore        │
                    │    Monster Catalog    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      React App        │
                    │                       │
                    │ Catalog               │
                    │ Collection            │
                    │ Wishlist              │
                    │ Statistics            │
                    └──────────────────────┘
```

The most important principle is:

> **External APIs are data providers. Firestore is the source of truth for Monster Vault.**

This ensures that Monster Vault can maintain a historical catalog even when external products disappear, APIs change, or external services become unavailable.
