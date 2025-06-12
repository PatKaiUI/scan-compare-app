import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org/api/v0";

export const fetchProduct = async (barcode) => {
  try {
    const res = await axios.get(`${BASE_URL}/product/${barcode}.json`);
    if (!res.data.product) {
      throw new Error("Produkt nicht gefunden");
    }
    return res.data.product;
  } catch (error) {
    console.error("Fehler beim Laden des Produkts:", error);
    throw error;
  }
};

export const fetchAlternativeProducts = async (category) => {
  try {
    // Suche nach Produkten in der gleichen Kategorie mit besserem Eco-Score
    const res = await axios.get(
      `${BASE_URL}/search?search_terms=${category}&sort_by=ecoscore_grade&page_size=5&json=true`
    );

    if (!res.data.products || res.data.products.length === 0) {
      return [];
    }

    return res.data.products.filter(
      (product) =>
        product.ecoscore_grade && product.image_url && product.product_name
    );
  } catch (error) {
    console.error("Fehler beim Laden der Alternativen:", error);
    return [];
  }
};

export const getSustainabilityData = (product) => {
  if (!product) return null;

  return {
    ecoscore: product.ecoscore_grade || "unknown",
    co2Footprint: product.environment_impact_level_tags || "unknown",
    packaging: product.packaging_tags || [],
    labels: product.labels_tags || [],
    ingredients: product.ingredients_analysis_tags || [],
    // Zusätzliche Nachhaltigkeitsinformationen
    nutriscore: product.nutriscore_grade || "unknown",
    palmOil: product.ingredients_analysis_tags?.includes("en:palm-oil-free")
      ? "Nein"
      : "Ja",
    additives: product.additives_tags || [],
    allergens: product.allergens_tags || [],
    // CO2-Fußabdruck Details
    carbonFootprint: {
      value: product.carbon_footprint_percent_of_known_ingredients || "unknown",
      unit: "g CO2e/100g",
    },
  };
};
