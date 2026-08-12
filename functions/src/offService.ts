import axios from 'axios';

export interface OpenFoodFactsProduct {
  id: string;
  code: string;
  product_name?: string;
  brands?: string;
  countries?: string;
  packaging?: string;
  size?: string;
  quantity?: string;
  image_url?: string;
  nutriments?: {
    caffeine_100g?: number;
    energy_kcal_100g?: number;
  };
  last_modified_t?: number;
}

export interface NormalizedProduct {
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

const OFF_API = 'https://world.openfoodfacts.org/api/v0/product';
const SEARCH_API = 'https://world.openfoodfacts.org/cgi/search.pl';

/**
 * Buscar produto por barcode no Open Food Facts
 */
export async function getProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await axios.get(`${OFF_API}/${barcode}.json`, {
      timeout: 10000,
    });

    if (response.data?.status === 1 && response.data.product) {
      return {
        id: response.data.product.id,
        code: response.data.product.code,
        product_name: response.data.product.product_name,
        brands: response.data.product.brands,
        countries: response.data.product.countries,
        packaging: response.data.product.packaging,
        image_url: response.data.product.image_url,
        nutriments: response.data.product.nutriments,
        last_modified_t: response.data.product.last_modified_t,
      };
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar produto ${barcode}:`, error);
    return null;
  }
}

/**
 * Buscar produtos Monster Energy no Open Food Facts
 */
export async function searchMonsterProducts(
  page: number = 1,
  pageSize: number = 100
): Promise<OpenFoodFactsProduct[]> {
  try {
    const response = await axios.get(SEARCH_API, {
      params: {
        search: 'Monster Energy',
        brands: 'Monster Energy',
        action: 'process',
        format: 'json',
        page,
        page_size: pageSize,
      },
      timeout: 15000,
    });

    if (response.data?.products) {
      return response.data.products as OpenFoodFactsProduct[];
    }

    return [];
  } catch (error) {
    console.error('Erro ao buscar produtos Monster:', error);
    return [];
  }
}

/**
 * Normalizar produto do Open Food Facts para formato interno
 */
export function normalizeProduct(offProduct: OpenFoodFactsProduct): NormalizedProduct | null {
  // Validar campos obrigatórios
  if (!offProduct.product_name || !offProduct.code) {
    return null;
  }

  // Extrair informações
  const brand = (offProduct.brands || 'Monster Energy')?.split(',')[0]?.trim() || 'Monster Energy';
  const name = offProduct.product_name.trim();
  const barcode = offProduct.code.trim();

  // Parsear país (pode vir como "United States" ou "US")
  let country = offProduct.countries?.split(',')[0]?.trim();
  if (country) {
    country = normalizeCountry(country);
  }

  // Extrair tamanho da descrição ou packaging
  let size = extractSize(offProduct.quantity || offProduct.packaging || '');

  // Extrair cafeína (em mg por 100g, precisamos normalizar)
  let caffeine: number | undefined;
  if (offProduct.nutriments?.caffeine_100g && offProduct.nutriments.caffeine_100g > 0) {
    // Open Food Facts fornece em mg/100g, multiplicar por quantidade em ml
    const sizeInMl = extractSizeNumber(size);
    if (sizeInMl) {
      caffeine = Math.round((offProduct.nutriments.caffeine_100g * sizeInMl) / 100);
    }
  }

  return {
    brand,
    name,
    barcode,
    country,
    size,
    imageUrl: offProduct.image_url,
    caffeine,
    description: `${brand} ${name}`,
    externalId: offProduct.id || offProduct.code,
    provider: 'open-food-facts',
    url: `https://world.openfoodfacts.org/product/${barcode}`,
  };
}

/**
 * Normalizar nome do país
 */
function normalizeCountry(country: string): string {
  const countryMap: Record<string, string> = {
    'United States': 'USA',
    'United Kingdom': 'UK',
    'Korea': 'South Korea',
    'Brazil': 'Brazil',
    'Mexico': 'Mexico',
    'Germany': 'Germany',
    'France': 'France',
    'Spain': 'Spain',
    'Italy': 'Italy',
    'Japan': 'Japan',
    'China': 'China',
    'Australia': 'Australia',
    'Canada': 'Canada',
    'Netherlands': 'Netherlands',
  };

  // Tentar encontrar no mapa
  for (const [key, value] of Object.entries(countryMap)) {
    if (country.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return country;
}

/**
 * Extrair tamanho de um texto (ex: "473 ml" → "473ml")
 */
function extractSize(text: string): string | undefined {
  if (!text) return undefined;

  // Tentar encontrar padrão "número + ml/l"
  const match = text.match(/(\d+)\s*m[lL]/i);
  if (match) {
    return `${match[1]}ml`;
  }

  // Tentar encontrar apenas número (assumir ml)
  const numberMatch = text.match(/^(\d+)$/);
  if (numberMatch) {
    return `${numberMatch[1]}ml`;
  }

  return undefined;
}

/**
 * Extrair número do tamanho (ex: "473ml" → 473)
 */
function extractSizeNumber(size?: string): number | undefined {
  if (!size) return undefined;

  const match = size.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}
