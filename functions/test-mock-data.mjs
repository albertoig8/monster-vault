/**
 * Mock de produtos Open Food Facts para testes
 */

export const MOCK_PRODUCTS = [
  {
    id: "8501234567890",
    code: "8501234567890",
    product_name: "Monster Energy Ultra Violet",
    brands: "Monster Energy",
    countries: "United States",
    packaging: "473 ml",
    quantity: "473",
    image_url: "https://static.openfoodfacts.org/images/products/850/123/456/7890/front.jpg",
    nutriments: {
      caffeine_100g: 32,
      energy_kcal_100g: 46
    },
    last_modified_t: Date.now() / 1000
  },
  {
    id: "8501234567891",
    code: "8501234567891",
    product_name: "Monster Energy Absolutely Zero",
    brands: "Monster, Energy Drink",
    countries: "USA",
    packaging: "473 ml can",
    quantity: "473 ml",
    image_url: "https://static.openfoodfacts.org/images/products/850/123/456/7891/front.jpg",
    nutriments: {
      caffeine_100g: 33,
      energy_kcal_100g: 2
    },
    last_modified_t: Date.now() / 1000
  },
  {
    id: "8501234567892",
    code: "8501234567892",
    product_name: "Monster Energy Mango Loco",
    brands: "Monster Energy",
    countries: "Brazil",
    packaging: "473 ml",
    quantity: "473",
    image_url: "https://static.openfoodfacts.org/images/products/850/123/456/7892/front.jpg",
    nutriments: {
      caffeine_100g: 32,
      energy_kcal_100g: 47
    },
    last_modified_t: Date.now() / 1000
  }
];

/**
 * Função para buscar mock products
 */
export function getMockProducts(pageSize = 100) {
  // Retornar todos os mocks (simular múltiplas páginas)
  return MOCK_PRODUCTS;
}
