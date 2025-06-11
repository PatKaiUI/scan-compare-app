export function getSustainabilityScore(product) {
  let score = 100;
  if (!product.labels_tags?.includes("organic")) score -= 30;
  if (product.nutriscore_grade === "e") score -= 30;
  if (!product.enviroment_impact_level_tags) score -= 20;
  return Math.max(score, 0);
}
