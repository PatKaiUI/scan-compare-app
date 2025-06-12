import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org/api/v0";

export const fetchProduct = async (barcode) => {
  try {
    const res = await axios.get(`${BASE_URL}/product/${barcode}.json`);
    return res.data.product;
  } catch (error) {
    console.error("Fehler beim Laden des Produkts:", error);
    throw error;
  }
};

export const fetchAlternativeProducts = async (category) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/search?search_terms=${category}&sort_by=ecoscore_grade&page_size=5`
    );
    return res.data.products;
  } catch (error) {
    console.error("Fehler beim Laden der Alternativen:", error);
    throw error;
  }
};

export const getSustainabilityData = (product) => {
  return {
    ecoscore: product.ecoscore_grade || "unknown",
    co2Footprint: product.environment_impact_level_tags || "unknown",
    packaging: product.packaging_tags || [],
    labels: product.labels_tags || [],
    ingredients: product.ingredients_analysis_tags || [],
  };
};
