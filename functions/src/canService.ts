/**
 * Tipos para Firestore
 */

export interface MonsterCan {
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
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface CanSource {
  provider: string;
  externalId?: string;
  url?: string;
  lastCheckedAt?: string; // ISO timestamp string
}

/**
 * Gerar ID determinístico para uma lata
 * Prioridade: barcode → externalId → gerado
 */
export function generateCanId(
  barcode?: string,
  externalId?: string,
  name?: string,
  country?: string
): string {
  if (barcode) {
    return barcode;
  }

  if (externalId) {
    return externalId;
  }

  // Gerar ID determinístico a partir de nome + país
  if (name) {
    const normalized = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (country) {
      return `${normalized}-${country.toLowerCase()}`;
    }

    return normalized;
  }

  throw new Error('Impossível gerar ID: barcode, externalId ou name é necessário');
}

/**
 * Buscar lata existente por barcode, externalId ou ID gerado
 */
export async function findExistingCan(
  db: any,
  barcode?: string,
  externalId?: string,
  name?: string,
  country?: string
): Promise<MonsterCan | null> {
  // Prioridade 1: Buscar por barcode
  if (barcode) {
    const docSnap = await db.collection('cans').doc(barcode).get();
    if (docSnap.exists) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as MonsterCan;
    }
  }

  // Prioridade 2: Buscar por externalId no campo sources
  if (externalId) {
    const query = await db
      .collection('cans')
      .where('sources', 'array-contains', {
        externalId,
      })
      .limit(1)
      .get();

    if (!query.empty) {
      const doc = query.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as MonsterCan;
    }
  }

  // Prioridade 3: Tentar ID gerado
  try {
    const generatedId = generateCanId(barcode, externalId, name, country);
    const docSnap = await db.collection('cans').doc(generatedId).get();
    if (docSnap.exists) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as MonsterCan;
    }
  } catch (error) {
    // Ignorar erro ao gerar ID
  }

  return null;
}

/**
 * Adicionar ou atualizar lata no Firestore
 */
export async function addOrUpdateCan(
  db: any,
  canData: Partial<MonsterCan>,
  existingCan?: MonsterCan | null
): Promise<{ canId: string; created: boolean }> {
  const canId =
    existingCan?.id ||
    generateCanId(canData.barcode, canData.sources?.[0]?.externalId, canData.name, canData.country);

  const now = new Date().toISOString();
  const isCreating = !existingCan;

  if (isCreating) {
    // Criar novo documento
    await db.collection('cans').doc(canId).set({
      id: canId,
      brand: canData.brand || '',
      name: canData.name || '',
      flavor: canData.flavor,
      description: canData.description,
      category: canData.category,
      country: canData.country,
      size: canData.size,
      barcode: canData.barcode,
      imageUrl: canData.imageUrl,
      releaseYear: canData.releaseYear,
      caffeine: canData.caffeine,
      sugar: canData.sugar,
      discontinued: canData.discontinued ?? false,
      edition: canData.edition,
      verified: canData.verified ?? false,
      sources: canData.sources || [],
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Atualizar documento existente
    const existingSources = existingCan.sources || [];

    // Mesclar fontes (evitar duplicatas)
    const newSource = canData.sources?.[0];
    let mergedSources = existingSources;

    if (newSource) {
      const sourceExists = existingSources.some(
        (s) => s.provider === newSource.provider && s.externalId === newSource.externalId
      );

      if (!sourceExists) {
        mergedSources = [...existingSources, newSource];
      } else {
        // Atualizar lastCheckedAt
        mergedSources = existingSources.map((s) =>
          s.provider === newSource.provider && s.externalId === newSource.externalId
            ? { ...s, lastCheckedAt: new Date().toISOString() }
            : s
        );
      }
    }

    // Atualizar apenas campos fornecidos
    const updateData: Partial<MonsterCan> = {
      updatedAt: now,
      sources: mergedSources,
    };

    // Atualizar campos se fornecidos
    if (canData.name !== undefined) updateData.name = canData.name;
    if (canData.flavor !== undefined) updateData.flavor = canData.flavor;
    if (canData.imageUrl !== undefined) updateData.imageUrl = canData.imageUrl;
    if (canData.caffeine !== undefined) updateData.caffeine = canData.caffeine;
    if (canData.description !== undefined) updateData.description = canData.description;
    if (canData.country !== undefined) updateData.country = canData.country;
    if (canData.size !== undefined) updateData.size = canData.size;
    if (canData.barcode !== undefined) updateData.barcode = canData.barcode;

    await db.collection('cans').doc(canId).update(updateData);
  }

  return { canId, created: isCreating };
}
