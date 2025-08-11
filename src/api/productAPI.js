import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org/api/v0";

// Axios-Instanz mit Timeout und Retry-Logic
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProduct = async (barcode) => {
  try {
    // Barcode-Validierung
    if (!barcode || barcode.length < 8) {
      throw new Error("Ungültiger Barcode");
    }

    const res = await apiClient.get(`/product/${barcode}.json`);

    if (!res.data || !res.data.product) {
      throw new Error("Produkt nicht gefunden");
    }

    // Zusätzliche Validierung der Produktdaten
    const product = res.data.product;
    if (!product.product_name) {
      throw new Error("Produktdaten unvollständig");
    }

    return product;
  } catch (error) {
    console.error("Fehler beim Laden des Produkts:", error);

    // Spezifische Fehlerbehandlung
    if (error.response?.status === 404) {
      throw new Error("Produkt nicht in der Datenbank gefunden");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Zeitüberschreitung - Bitte versuchen Sie es erneut");
    } else if (error.message) {
      throw error;
    } else {
      throw new Error("Netzwerkfehler - Bitte überprüfen Sie Ihre Verbindung");
    }
  }
};

export const fetchAlternativeProducts = async (product) => {
  try {
    if (!product) {
      return [];
    }

    const productName = product.product_name;
    const category = product.categories_tags?.[0];

    if (!productName || !category) {
      return [];
    }

    // Verbesserte Suche nach Alternativen
    const res = await apiClient.get(
      `${BASE_URL}/search?search_terms=${productName} ${category}&sort_by=ecoscore_grade&page_size=10&json=true`
    );

    if (!res.data.products || res.data.products.length === 0) {
      return [];
    }

    // Filtere und sortiere nach Qualität
    return res.data.products
      .filter(
        (product) =>
          product.ecoscore_grade &&
          product.image_url &&
          product.product_name &&
          product.ecoscore_grade !== "unknown"
      )
      .sort((a, b) => {
        const scoreOrder = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        return scoreOrder[a.ecoscore_grade] - scoreOrder[b.ecoscore_grade];
      })
      .slice(0, 6); // Maximal 6 Alternativen
  } catch (error) {
    console.error("Fehler beim Laden der Alternativen:", error);
    return [];
  }
};

export const getSustainabilityData = (product) => {
  if (!product) return null;

  // Verbesserte Datenverarbeitung
  const ecoscore = product.ecoscore_grade || "unknown";
  const nutriscore = product.nutriscore_grade || "unknown";

  // CO2-Fußabdruck Berechnung
  const carbonFootprint =
    product.carbon_footprint_percent_of_known_ingredients ||
    product.environment_impact_level_tags?.[0] ||
    "unknown";

  return {
    ecoscore,
    co2Footprint: product.environment_impact_level_tags || "unknown",
    packaging: product.packaging_tags || [],
    labels: product.labels_tags || [],
    ingredients: product.ingredients_analysis_tags || [],
    nutriscore,
    palmOil: product.ingredients_analysis_tags?.includes("en:palm-oil-free")
      ? "Nein"
      : product.ingredients_analysis_tags?.includes("en:palm-oil")
      ? "Ja"
      : "Unbekannt",
    additives: product.additives_tags || [],
    allergens: product.allergens_tags || [],
    carbonFootprint: {
      value: carbonFootprint,
      unit: typeof carbonFootprint === "number" ? "g CO2e/100g" : "",
    },
    // Zusätzliche Nachhaltigkeitsdaten
    organic: product.labels_tags?.includes("en:organic") || false,
    fairTrade: product.labels_tags?.includes("en:fair-trade") || false,
    vegan: product.labels_tags?.includes("en:vegan") || false,
    vegetarian: product.labels_tags?.includes("en:vegetarian") || false,
  };
};
