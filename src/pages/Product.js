import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchAlternativeProducts,
  getSustainabilityData,
} from "../api/productAPI";

function Product() {
  const { barcode } = useParams();

  const { data: product, isLoading: productLoading } = useQuery(
    ["product", barcode],
    () => fetchProduct(barcode)
  );

  const { data: alternatives, isLoading: alternativesLoading } = useQuery(
    ["alternatives", product?.categories_tags?.[0]],
    () => fetchAlternativeProducts(product?.categories_tags?.[0]),
    {
      enabled: !!product?.categories_tags?.[0],
    }
  );

  if (productLoading) return <div className="p-4">Lade Produkt...</div>;
  if (!product) return <div className="p-4">Kein Produkt gefunden</div>;

  const sustainabilityData = getSustainabilityData(product);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{product.product_name}</h1>
        <img
          src={product.image_front_url}
          alt={product.product_name}
          className="w-48 h-48 object-contain mx-auto mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Produktinformationen</h2>
            <p>
              <strong>Marke:</strong> {product.brands}
            </p>
            <p>
              <strong>Kategorie:</strong> {product.categories_tags?.[0]}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Nachhaltigkeit</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Eco-Score:</span>
              <span
                className={`px-2 py-1 rounded ${
                  sustainabilityData.ecoscore === "a"
                    ? "bg-green-500"
                    : sustainabilityData.ecoscore === "b"
                    ? "bg-green-300"
                    : sustainabilityData.ecoscore === "c"
                    ? "bg-yellow-300"
                    : sustainabilityData.ecoscore === "d"
                    ? "bg-orange-300"
                    : sustainabilityData.ecoscore === "e"
                    ? "bg-red-300"
                    : "bg-gray-300"
                }`}
              >
                {sustainabilityData.ecoscore.toUpperCase()}
              </span>
            </div>
            <p>
              <strong>CO2-Fußabdruck:</strong> {sustainabilityData.co2Footprint}
            </p>
            {sustainabilityData.labels.length > 0 && (
              <p>
                <strong>Labels:</strong> {sustainabilityData.labels.join(", ")}
              </p>
            )}
          </div>
        </div>

        {alternativesLoading ? (
          <p>Lade Alternativen...</p>
        ) : alternatives && alternatives.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Nachhaltigere Alternativen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map((alt) => (
                <div key={alt.code} className="border rounded-lg p-4">
                  <img
                    src={alt.image_front_url}
                    alt={alt.product_name}
                    className="w-32 h-32 object-contain mx-auto mb-2"
                  />
                  <h3 className="font-semibold">{alt.product_name}</h3>
                  <p className="text-sm">
                    Eco-Score:{" "}
                    {alt.ecoscore_grade?.toUpperCase() || "Unbekannt"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Product;
