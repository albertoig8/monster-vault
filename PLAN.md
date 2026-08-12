# Monster Vault — Development Plan

## 1. Project Overview

Monster Vault is a web application for managing and cataloging a personal collection of Monster Energy cans.

The application should allow users to:

* Browse a catalog of Monster Energy cans.
* Search and filter cans.
* View detailed information about a can.
* Add cans to their personal collection.
* Remove cans from their collection.
* Track quantities and duplicates.
* Create a wishlist of cans they want to collect.
* View statistics about their collection.
* Automatically update the global can catalog once per day.

The project should initially focus on simplicity, maintainability, and a clean user experience.

Do not implement advanced features before the MVP is complete.

---

# 2. Technology Stack

Use the following technologies:

* React
* TypeScript
* Firebase
* Firebase Authentication
* Cloud Firestore
* Firebase Cloud Functions
* Firebase Hosting or Vercel
* CSS for styling

Avoid adding unnecessary libraries.

Prefer native React functionality and simple solutions whenever possible.

The application should be responsive and work well on desktop and mobile devices.

---

# 3. Architecture

Separate the application into two main concepts:

## Global Catalog

The global catalog contains all known Monster Energy cans.

Example information:

```text
id
name
flavor
description
category
size
country
releaseYear
imageUrl
barcode
caffeine
sugar
discontinued
createdAt
updatedAt
```

## User Collection

The user's collection references cans from the global catalog.

Do not duplicate complete can information inside the user's collection.

The relationship should be:

```text
User
  |
  └── Collection
        |
        ├── Can A
        ├── Can B
        └── Can C

Can Catalog
  |
  ├── Can A
  ├── Can B
  ├── Can C
  └── Can D
```

A user collection item should contain information such as:

```text
canId
quantity
addedAt
notes
```

---

# 4. Firestore Structure

Use the following initial structure:

```text
users
  └── {userId}
       ├── name
       ├── email
       └── createdAt

cans
  └── {canId}
       ├── name
       ├── flavor
       ├── description
       ├── category
       ├── size
       ├── country
       ├── releaseYear
       ├── imageUrl
       ├── barcode
       ├── caffeine
       ├── sugar
       ├── discontinued
       ├── createdAt
       └── updatedAt

users/{userId}/collection
  └── {canId}
       ├── quantity
       ├── addedAt
       └── notes

users/{userId}/wishlist
  └── {canId}
       └── addedAt
```

Use the can document ID as the reference in the user's collection.

---

# 5. Project Structure

Use a clean and simple structure similar to:

```text
src/
├── components/
├── pages/
│   ├── Home/
│   ├── Catalog/
│   ├── Collection/
│   ├── CanDetails/
│   ├── AddCan/
│   └── Wishlist/
├── services/
│   ├── firebase/
│   ├── cans/
│   └── collection/
├── hooks/
├── types/
├── utils/
├── routes/
└── App.tsx

functions/
├── src/
│   ├── catalog/
│   └── index.ts
└── package.json
```

Keep components small and focused.

Do not create abstractions unless they provide real value.

---

# 6. MVP — Phase 1

The first goal is to create a fully functional MVP.

Implement the following features first.

## 6.1 Application Layout

Create:

* Header
* Navigation
* Main content area
* Responsive layout

Navigation should contain:

```text
Home
Catalog
My Collection
Wishlist
```

Authentication can initially be kept simple.

---

# 7. Catalog

Create a Catalog page displaying all cans stored in Firestore.

Each can should display:

* Image
* Name
* Flavor
* Country
* Size
* Release year
* Availability/discontinued status

Use a card-based layout.

Example:

```text
┌──────────────────────────┐
│                          │
│       CAN IMAGE          │
│                          │
├──────────────────────────┤
│ Monster Ultra Violet     │
│ Grape                    │
│ 🇺🇸 USA                   │
│ 473ml                    │
│                          │
│ [ View Details ]         │
└──────────────────────────┘
```

---

# 8. Search

Add a search field to the Catalog page.

The user should be able to search by:

* Name
* Flavor
* Country

The search experience should be simple and responsive.

Avoid implementing complex search infrastructure during the MVP.

---

# 9. Can Details

Create a details page for each can.

Display:

* Large image
* Name
* Flavor
* Description
* Country
* Size
* Release year
* Barcode
* Caffeine
* Sugar
* Discontinued status

Include:

```text
[ Add to Collection ]
[ Add to Wishlist ]
```

If the can is already in the collection, display its current quantity.

Example:

```text
Monster Mango Loco

Mango flavored energy drink

Country: Brazil
Size: 473ml
Year: 2024

Quantity owned: 2

[ - ] 2 [ + ]

[ Remove from Collection ]
```

---

# 10. My Collection

Create a page where the user can see all cans they own.

Display:

```text
My Collection

Total Cans: 124
Unique Cans: 87
Different Flavors: 38
Countries: 12
```

Below the statistics, display the collection as cards.

Each card should show:

* Image
* Name
* Flavor
* Country
* Quantity

Allow the user to:

* Increase quantity
* Decrease quantity
* Remove the can

Do not duplicate can information in Firestore.

Load can information from the global `cans` collection using the `canId`.

---

# 11. Wishlist

Create a Wishlist page.

The user should be able to add a catalog item to the wishlist.

Display:

```text
My Wishlist

12 cans

[ Can cards ]
```

Each item should have:

```text
[ Add to Collection ]
[ Remove from Wishlist ]
```

When adding an item from the wishlist to the collection:

1. Add it to the collection.
2. Remove it from the wishlist.

---

# 12. Authentication

Use Firebase Authentication.

Initially support:

* Email/password
* Google authentication if simple to configure

Users must only be able to access and modify their own:

```text
users/{userId}/collection
users/{userId}/wishlist
```

The global `cans` collection should be readable by authenticated users.

Only backend/admin functionality should modify the global catalog.

Configure Firestore security rules accordingly.

Never expose administrative Firebase credentials in the frontend.

---

# 13. Catalog Data Source

Find a reliable external source containing Monster Energy product information.

Possible sources include:

* Open Food Facts
* Public product APIs
* Public datasets
* Public GitHub datasets
* Other reliable sources containing product information

Prioritize sources that provide:

* Product name
* Flavor
* Country
* Barcode
* Image
* Nutritional information

Do not make the frontend depend directly on the external API.

The external API should only be used by the backend synchronization process.

---

# 14. Daily Catalog Synchronization

Create a Firebase Cloud Function responsible for synchronizing the external catalog.

The function should run once per day.

Flow:

```text
Scheduled Function
       ↓
External API
       ↓
Fetch products
       ↓
Normalize data
       ↓
Validate data
       ↓
Compare with Firestore
       ↓
Create new cans
       ↓
Update existing cans
       ↓
Mark discontinued products when appropriate
```

The synchronization must be idempotent.

Running the function multiple times should not create duplicate cans.

Use a stable identifier whenever possible.

Preferred identifiers:

1. Barcode
2. External API product ID
3. Generated deterministic ID

Do not use random IDs when synchronization requires identifying the same product later.

---

# 15. Catalog Synchronization Metadata

Create a document to store synchronization information.

Example:

```text
catalogMetadata
  └── sync
       ├── lastStartedAt
       ├── lastCompletedAt
       ├── lastSuccessfulAt
       ├── totalProcessed
       ├── totalCreated
       ├── totalUpdated
       └── lastError
```

The application can display:

```text
Catalog last updated:
August 12, 2026
```

Only update `lastSuccessfulAt` when the synchronization finishes successfully.

---

# 16. Data Normalization

External API data should be normalized before being saved to Firestore.

Create a normalized internal model:

```typescript
interface MonsterCan {
  id: string;
  name: string;
  flavor?: string;
  description?: string;
  category?: string;
  size?: string;
  country?: string;
  releaseYear?: number;
  imageUrl?: string;
  barcode?: string;
  caffeine?: number;
  sugar?: number;
  discontinued: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

External API models should not be used directly throughout the application.

Create a mapper/adapter between external data and the internal `MonsterCan` model.

---

# 17. Home Dashboard

Create a simple dashboard.

Display:

```text
Welcome to Monster Vault

Your Collection

124 Cans
87 Unique Cans
38 Flavors
12 Countries
```

Also display:

```text
Collection Progress

87 / 200 known cans
```

And a small section:

```text
Recently Added
```

showing the latest cans added to the user's collection.

---

# 18. Filters

After the basic catalog is working, add filters:

```text
Country
Flavor
Size
Release Year
Status
```

Add sorting:

```text
Name
Newest
Oldest
Country
```

Keep the implementation simple.

---

# 19. Collection Statistics

Create useful statistics:

```text
Total cans
Unique cans
Different flavors
Different countries
Duplicate cans
```

Example:

```text
Total Cans       124
Unique Cans       87
Duplicates        37
Flavors           38
Countries         12
```

Do not introduce a complex analytics system.

Calculate these values from the user's collection when practical.

---

# 20. Future Features

Do not implement these features during the MVP.

Keep them as future roadmap items.

## Barcode Scanner

Allow users to scan the barcode on a can.

Flow:

```text
Camera
   ↓
Barcode
   ↓
Firestore
   ↓
Can found?
   ↓
Add to collection
```

If not found, search the external catalog.

---

## Rarity

Possible rarity levels:

```text
Common
Uncommon
Rare
Very Rare
Limited Edition
```

Rarity should initially be manually managed or based on reliable catalog information.

Do not invent rarity automatically.

---

## Achievements

Examples:

```text
First Can
100 Cans
Collector
World Traveler
Ultra Fan
Monster Hunter
```

---

## Public Collector Profiles

Allow users to create a public collection profile.

Example:

```text
/collector/{username}
```

Display:

```text
Collector Name

124 cans
87 unique cans
12 countries
38 flavors
```

Only implement this after the core application is stable.

---

## Collection Sharing

Allow users to share their collection through a public URL.

---

## Collector Ranking

Possible future leaderboard:

```text
1. Collector A — 432 cans
2. Collector B — 287 cans
3. Collector C — 201 cans
```

Only implement after authentication and public profiles are working.

---

# 21. UI Guidelines

The application should have a modern energy-drink-inspired visual identity without becoming visually overwhelming.

Use:

* Dark theme
* High contrast
* Card-based catalog
* Large product images
* Clear buttons
* Responsive design
* Simple animations

Prioritize usability over visual effects.

The application should feel like a collection management tool, not an e-commerce website.

---

# 22. Error Handling

Implement proper handling for:

* Firebase errors
* Network errors
* External API errors
* Empty catalog
* Missing images
* Missing product information
* Failed synchronization
* Unauthorized requests

The UI should display friendly messages.

Never expose raw backend errors to users.

---

# 23. Loading States

Every asynchronous operation should have a loading state.

Examples:

```text
Loading catalog...

Loading collection...

Adding to collection...

Updating...

Synchronizing catalog...
```

Avoid blank screens while data is loading.

---

# 24. Empty States

Create useful empty states.

Example:

```text
Your collection is empty.

Start building your Monster Vault.

[ Browse Catalog ]
```

Wishlist:

```text
Your wishlist is empty.

Find a can you'd like to collect.

[ Browse Catalog ]
```

---

# 25. Security

Follow these rules:

* Never expose private credentials.
* Use Firebase Authentication.
* Use Firestore security rules.
* Users can only modify their own collection.
* Users can only modify their own wishlist.
* Users cannot modify the global catalog directly.
* Catalog synchronization must happen through trusted backend code.
* Validate all data received from external APIs.

---

# 26. Development Strategy

Develop the project incrementally.

Do NOT attempt to implement all features at once.

Follow this order:

### Step 1

Create the React + TypeScript project.

### Step 2

Configure Firebase.

### Step 3

Create TypeScript models.

### Step 4

Create Firestore structure.

### Step 5

Implement authentication.

### Step 6

Create the Catalog page.

### Step 7

Create the Can Details page.

### Step 8

Implement adding/removing cans from the collection.

### Step 9

Create My Collection.

### Step 10

Create Wishlist.

### Step 11

Add search.

### Step 12

Add filters.

### Step 13

Add collection statistics.

### Step 14

Find and integrate the external catalog source.

### Step 15

Create the Cloud Function for daily synchronization.

### Step 16

Add synchronization metadata and logging.

### Step 17

Improve responsive design and UX.

### Step 18

Only after the MVP is stable, implement advanced features.

---

# 27. Important Development Rules

Follow these rules throughout development:

1. Keep the architecture simple.
2. Avoid unnecessary dependencies.
3. Prefer readable code over clever code.
4. Use TypeScript types everywhere appropriate.
5. Keep Firebase access inside service modules.
6. Keep UI components independent from Firebase implementation details.
7. Do not duplicate catalog data inside user collections.
8. Do not call external APIs directly from UI components.
9. Handle loading, errors, and empty states.
10. Do not implement future features before the current phase is stable.
11. Do not introduce complex state management unless it becomes necessary.
12. Keep functions small and focused.
13. Use meaningful names.
14. Add comments only when the reason behind the code is not obvious.
15. Preserve existing functionality when adding new features.

---

# 28. Definition of Done — MVP

The MVP is considered complete when a user can:

1. Create an account.
2. Log in.
3. Browse Monster Energy cans.
4. Search for cans.
5. Open a can's details.
6. Add a can to their collection.
7. Increase or decrease the quantity.
8. Remove a can from their collection.
9. View their complete collection.
10. Add a can to their wishlist.
11. Remove a can from their wishlist.
12. Move a can from wishlist to collection.
13. View basic collection statistics.
14. Use the application on desktop and mobile.
15. See useful loading and error states.

The catalog synchronization can be considered a separate milestone after the basic application is working.

---

# 29. GitHub Development Approach

Create small, focused commits.

Examples:

```text
feat: initialize React application
feat: configure Firebase
feat: add authentication
feat: create can catalog
feat: add can details page
feat: add collection management
feat: add wishlist
feat: add catalog search
feat: add collection statistics
feat: add catalog synchronization
fix: handle missing can images
fix: improve collection loading state
```

Avoid large commits containing unrelated features.

---

# 30. Final Goal

The final application should feel like a digital vault for Monster Energy collectors.

The core experience should be:

```text
Discover a can
      ↓
View its information
      ↓
Add it to Wishlist
      ↓
Get the can
      ↓
Add it to Collection
      ↓
Track the collection
      ↓
Complete the catalog
```

The application should start simple but have a clean architecture that allows future features such as barcode scanning, achievements, rarity, public collections, sharing, and collector rankings without requiring a complete rewrite.
